-- RPC hardening supplement for the multi-tenant carpool blueprint.
-- Review and apply only to the dedicated carpool Supabase project.

create or replace function public.request_ride_seat(p_ride_id uuid)
returns public.seat_requests
language plpgsql
security invoker
set search_path=''
as $$
declare v_ride public.rides; v_request public.seat_requests;
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  select * into v_ride from public.rides where id=p_ride_id;
  if not found or not public.is_org_member(v_ride.organization_id) then raise exception 'Ride not available'; end if;
  if v_ride.driver_id=(select auth.uid()) then raise exception 'Driver cannot request own ride'; end if;
  if v_ride.status<>'open' or v_ride.seats_available<1 then raise exception 'No seats available'; end if;
  insert into public.seat_requests(organization_id,event_id,ride_id,passenger_id,status)
  values(v_ride.organization_id,v_ride.event_id,v_ride.id,(select auth.uid()),'pending')
  on conflict(ride_id,passenger_id) do update set status=case when public.seat_requests.status in ('cancelled','declined','expired') then 'pending'::public.request_status else public.seat_requests.status end
  returning * into v_request;
  return v_request;
end $$;

create or replace function public.decide_ride_seat_request(p_request_id uuid,p_accept boolean)
returns public.seat_requests
language plpgsql
security invoker
set search_path=''
as $$
declare v_req public.seat_requests;v_ride public.rides;
begin
 select * into v_req from public.seat_requests where id=p_request_id for update;
 if not found or v_req.status<>'pending' then raise exception 'Request is not pending'; end if;
 select * into v_ride from public.rides where id=v_req.ride_id for update;
 if v_ride.driver_id<>(select auth.uid()) and not public.is_org_admin(v_req.organization_id) then raise exception 'Not allowed'; end if;
 if p_accept then
   if v_ride.status<>'open' or v_ride.seats_available<1 then raise exception 'No seats available'; end if;
   update public.rides set seats_available=seats_available-1,status=case when seats_available-1=0 then 'full'::public.ride_status else status end where id=v_ride.id;
   update public.seat_requests set status='accepted' where id=v_req.id returning * into v_req;
   insert into public.ride_participants(organization_id,event_id,ride_id,user_id,mode,status) values(v_req.organization_id,v_req.event_id,v_req.ride_id,v_req.passenger_id,'passenger','accepted') on conflict(ride_id,user_id) do update set status='accepted';
 else update public.seat_requests set status='declined' where id=v_req.id returning * into v_req;
 end if;
 return v_req;
end $$;

create or replace function public.cancel_ride_seat_request(p_request_id uuid)
returns public.seat_requests language plpgsql security invoker set search_path='' as $$
declare v_req public.seat_requests;begin
 select * into v_req from public.seat_requests where id=p_request_id for update;
 if not found or v_req.passenger_id<>(select auth.uid()) then raise exception 'Not allowed'; end if;
 if v_req.status='accepted' then update public.rides set seats_available=least(seats_total,seats_available+1),status=case when status='full' then 'open'::public.ride_status else status end where id=v_req.ride_id;delete from public.ride_participants where ride_id=v_req.ride_id and user_id=v_req.passenger_id;end if;
 update public.seat_requests set status='cancelled' where id=v_req.id returning * into v_req;return v_req;end $$;

revoke all on function public.request_ride_seat(uuid) from public,anon;
revoke all on function public.decide_ride_seat_request(uuid,boolean) from public,anon;
revoke all on function public.cancel_ride_seat_request(uuid) from public,anon;
grant execute on function public.request_ride_seat(uuid) to authenticated;
grant execute on function public.decide_ride_seat_request(uuid,boolean) to authenticated;
grant execute on function public.cancel_ride_seat_request(uuid) to authenticated;
