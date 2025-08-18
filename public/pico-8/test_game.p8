pico-8 cartridge // http://www.pico-8.com
version 43
__lua__
-- dARK sTREETS (tECH dEMO 1)
-- BY YAKY.DEV

function _init()
	-- game / global state
	-- 0 = main menu
	-- 1 = active game
	-- 3 = intro
	-- 6 = death
	-- 7 = victory
	-- 021 = loading game
	-- 126 = in-game death screen
	-- 127 = in-game win screen
	_gs=1
	-- definitions
	init_defs()
	-- keep palette on exit
	poke(0x5f2e,1)
	pal(_drwpal[0],1)
	-- game objects
	_objs={}
	-- actives: doors etc
	_acts={}
	-- map coordinates to actives
	-- for quick lookups
	_map2acts={}
	-- player
	_plr={
		t="p",
		x=3*8+4,y=7*8+4,z=0,a=0,
		vx=0,vy=0,vz=0,va=0,
		r=2,
		hp=50,
	}
	add(_objs,_plr)
	-- load map
	init_map_objs()
	_map2acts[16+4*128].txt="ziggy's"
	_map2acts[17+9*128].txt="cedar pub"
	-- camera
	_cam={
		x=0,
		y=0,
		a=0 -- angle
	}
	-- z-buffer
	_zbuf={}
	-- console message
	-- top of screen
	_msg_text="dARK sTREETS tECH dEMO 1"
	_msg_time=0
	-- action message
	-- middle of screen
	_act_text=""
	_act_txt2=""
	-- performance mode
	-- how many lines to draw for
	-- walls, floors and ceilings
	_perf=1
	_perf_t=time()
	-- screen animations
	-- used by hud draw function
	_scr_red_t=0 -- red screen
	_scr_grn_t=0 -- green screen
	updt_cam()
end

function _update()
	if _gs==1 then
		-- process player controls
		updt_plr()
		-- move+update objects
		updt_objs()
		-- process actives
		updt_acts()
		-- move camera to player
		updt_cam()
		-- update hud animations etc
		updt_hud()
		-- degrade graphics
		--[[if stat(1)>1 then
			g_perf=2
			g_perf_t=time()+5
		elseif time()>g_perf_t
		and g_perf==2
		then
			g_perf=1
		end]]--
	end
end

function _draw()
	draw_clear()
	draw_floor()
	draw_walls()
	draw_objs()
	-- draw all effects
	--draw_effs(_effs,g_cam,zbuf)
	if _gs==1 then
		draw_hud(_plr)
	end
	-- debug
	--[[
	map(0,0,0,0,16,16)
	circ(g_cam.x,g_cam.y,2,12)
	line(g_cam.x,g_cam.y,
		g_cam.x+cos(g_cam.a)*64,
		g_cam.y+sin(g_cam.a)*64,13)
	]]--
	-- debug info
	--print("cpu:" .. flr(stat(1)*100) .. "%",1,7,11)
	--print("mem:" .. flr(stat(0)) .. "kib",40,7,11)
	--print("fps:" .. stat(7),88,7,11)
	if _gs==0 then
		-- main menu
		print("\^w\^tdARK sTREETS",16,33,0)
		print("\^w\^tdARK sTREETS",16,32,5+(rnd(5)<1 and 2 or 1))
	end
end

function init_game()
end

function _updt_game()
	
end

function draw_game()
	
end

-->8
-- game data

function init_defs()
-- game object definitions
-- s = sprite number
-- t = type (for collisions)
--  a = ally bullet (player's)
--  b = bullet (enemy's)
--  c = ceiling decor (walk-thru)
--  d = decor (solid)
--  e = enemy (solid)
--  f = floor decor (shoot-thru)
--  i = item
--  p = player
-- z = initial height
-- r = physical radius
-- w = visible width 1-8
-- h = visible height 1-8
-- ssx = spritesheet x
-- ssy = spritesheet y
-- ssw = spritesheet width
-- ssh = spritesheet height
_objdef=parse
" s,n,t,z,r,w,h,ssx,ssy,ssw,ssh;\
 11,tree,d,0,1,2,8, 88,  0, 8,32;\
 12,lamp,d,0,1,2,8, 96,  0, 8,32;\
 13,bulb,c,7,1,2,2,104,  0, 7, 8;\
 32,fire,d,0,4,4,8,  0, 16, 8,16;\
 34, bot,e,0,2,4,6,  0,  8, 8,24;\
 38,tabl,f,0,2,4,4, 48, 16,16,16;\
174,g_sg,i,0,1,2.5,1,112,80,10,4;\
175,g_gg,i,0,1,2.5,1,112,84,10,4;\
190,g_ft,i,0,1,2.5,1,112,88,10,4;\
191,g_rl,i,0,1,2.5,1,112,92,10,4;\
206,h_sm,i,0,1,2,2,112, 96, 8, 8;\
207,h_lg,i,0,1,2,2,120, 96, 8, 8;\
208,zomb,e,0,2,4,6,  0,104,15,24;\
210,cult,e,0,2,4,6, 16,104,15,24;\
801,bolt,b,2,0,2,2, 32, 96, 8, 8;\
802,buck,b,2,0,2,2, 40, 96, 7, 7;\
803,bult,b,2,0,1,1, 48, 96, 8, 8;\
804,fire,b,2,0,2,2, 56, 96, 8, 8;\
805,rokt,b,2,0,2,2, 64, 96, 8, 8"
_objdef[32].f_draw=draw_big_fire
-- health
_objdef[206].hp=5
_objdef[207].hp=25
-- shots
for s=801,805 do
	_objdef[s].f_coll=coll_shot
end
_objdef[801].f_draw=draw_bolt
--_objdef[802].f_draw=draw_buck
_objdef[804].ttl=30
_objdef[804].f_draw=draw_fire
_objdef[804].f_updt=updt_fire
-- more definitions for enemies
-- hp = hitpoints
-- spd = movement speed
-- aim_l = length of aim
-- atk_l = length of attack
-- rdy_l = length to reload
local edefs=parse
"e,s,n,hp,spd,aim_l,atk_l,rdy_l;\
 1,208,zomb, 10,0.1,  0,0.2,0.5;\
 2,210,cult, 35,0.2,1.0,1.0,2.5"
for e=1,#edefs do
	local edef=edefs[e]
	for k,v in pairs(edef) do
		_objdef[edef.s][k]=v
	end
end
-- zombie
_objdef[208].f_updt=updt_zomb
_objdef[208].f_draw=draw_zomb
_objdef[208].f_coll=coll_zomb
-- cultist
_objdef[210].f_updt=updt_hmnd
_objdef[210].f_draw=draw_hmnd
--_objdef[210].f_coll=coll_zomb
-- weapon pickups
-- wpn = weapon this item gives
-- ammo = amount of ammo
-- msg = silly console message
local wdefs=parse
"w,s,wpn,ammo,msg;\
2,174,2,12,gOT THE SHOTGUN. bARRELS OF FUN!;\
3,175,3,20,gOT THE GATLING gAUSS GUN!;\
4,190,4,50,fLAMMENWERFER! iT WERFS FLAMMEN!;\
5,191,5, 5,gOT THE qUAKER ROCKET LAUNCHER"
for w=2,#wdefs do
	local wdef=wdefs[w]
	for k,v in pairs(wdef) do
		_objdef[wdef.s][k]=v
	end
end
-- weapon definitions
-- addressed by number
-- n = name
-- dmg = damage
-- rof = seconds between shots
-- asp = angle spread
-- def = which object to shoot
-- spd = projectile speed
_wpndef=parse
"k,n,dmg,rof,asp,def,spd;\
1,gp, 10,0.50,0.000,801,2;\
2,sg, 20,1.50,0.002,802,2;\
3,gg,  5,0.26,0.005,803,2;\
4,ft,  1,0.05,0.001,804,1;\
5,rl,100,0.75,0.005,805,1"
-- screen palette
_scrpal=parse
"k,\
0,1,2,3,\
4,5,6,7,\
8,9,10,11,\
12,13,14,15;\
0,\
  0,128,133,  3,\
132,  5,  6,  7,\
136,137, 10, 11,\
 12, 13,  8,140;\
1,\
128,130,130,  2,\
  2,  2,136,  8,\
136,136,  8,136,\
136,  2,136,  8;\
2,\
  0,129,131,  3,\
131,  3, 11,138,\
139,139, 11, 11,\
 11,139, 11,139;\
3,\
  0,129,129,  1,\
  1,  1,140, 12,\
140,140, 12,140,\
140,  1,140, 12;\
4,\
  0,129,131,  3,\
131,  3, 11,138,\
139,139, 11, 11,\
 11,139, 11,139"
-- draw palette
-- fade to black, 4 levels
-- +red shade for damage
_drwpal={}
for p=0,4 do
	_drwpal[p]={}
	for c=0,15 do
		_drwpal[p][c]=sget(c,p)
	end
end
end

function parse(str)
	-- parse data string to table
	-- each line separated by ;
	-- each item separated by ,
	local tbl={}
	local rows=split(str,";")
	-- line 1 = list of keys
	local keys=split(rows[1])
	-- lines 2+ = data
	for r=2,#rows do
		printh("row "..r..": "..rows[r])
		local vals=split(rows[r])
		-- value 1 is table key
		--printh("val1: "..vals[1])
		tbl[vals[1]]={}
		for k=2,#keys do
			--printh("key "..k..": "..keys[k])
			--printh("val "..k..": "..vals[k])
			tbl[vals[1]][keys[k]]=vals[k]
		end
	end
	return tbl
end

function slow(v,f)
	return max(abs(v)-(f or 0.1),0)*sgn(v)
end
-->8
-- object and map functions

function init_obj(id,x,y)
	local def=_objdef[id]
	if def!=nil then
		--printh(id .. " @ " .. x .. ", " .. y)
		local o={
			x=x,
			y=y,
			vx=0,
			vy=0,
			vz=0,
			seed=rnd()
		}
		-- copy properties from def
		for k,v in pairs(def) do
			o[k]=v
		end
		if o.t=="e" then
			-- states
			-- 0=wait
			-- 1=walk
			-- 2=aim
			-- 3=attack
			-- 4=hit
			-- 6=death
			o.st8=0
			-- time to next state
			o.st8_t=0
			-- time to process
			--obj.proc_t=0
			-- destination
			o.dstx=o.x
			o.dsty=o.y
			-- action timings
			o.atk_t=0
			o.rdy_t=0
		end
		add(_objs,o)
		return o
	end
	return nil
end

function dmg_obj(o,dmg)
	if o.t=="e"
	or o.t=="p"
	then
		-- take damage
		o.hp=max(o.hp-dmg,0)
		if o.t=="e" then
			-- stop moving
			o.vx,o.vy=0,0
			-- go to "hit" state
			-- and stay in it
			o.st8=4
			o.st8_t=time()+0.2
		else
			-- flash player's screen
			_scr_red_t=time()+0.2
		end
	end
end

function updt_objs()
	local objs=_objs
	for o in all(objs) do
		-- try to move
		-- process collisions
		-- object that was hit
		-- 0=wall
		local ohit=nil
		if o.vx!=nil and o.vy!=nil
		then
			-- current coordinates
			local x,y=
				o.x,o.y
			-- new coordinates
			local xn,yn=
				x+o.vx,y+o.vy
			-- directions
			local xdir,ydir=
				sgn(o.vx),sgn(o.vy)
			local r=o.r
			-- collision direction
			-- check for walls
			-- check axes separately
			if is_wall(xn+r*xdir,y)
			or is_wall(xn+r*xdir,y+r)
			or is_wall(xn+r*xdir,y-r)
			then
				o.vx=0
				ohit=0
			end
			if is_wall(x,  yn+r*ydir)
			or is_wall(x+r,yn+r*ydir)
			or is_wall(x-r,yn+r*ydir)
			then
				o.vy=0
				ohit=0
			end
			-- update new coordinates
			-- after colliding with walls
			xn,yn=x+o.vx,y+o.vy
			-- check other objects
			-- everything collides with decor
			-- bullets do not collide with enemies
			-- player's bullets do not collide with player
			-- any bullets do not collide with tables
			for oo in all(objs) do
				if oo!=o
				and (oo.t=="d"
					or (oo.t=="e" and o.t!="b")
					or (oo.t=="p" and o.t!="a")
					or (oo.t=="f" and o.t!="a" and o.t!="b"))
				then
					local rr=o.r+oo.r
					if abs(xn-oo.x)<rr
					and abs(y-oo.y)<rr
					then
						o.vx=0
						ohit=oo
					end
					if abs(x-oo.x)<rr
					and abs(yn-oo.y)<rr
					then
						o.vy=0
						ohit=oo
					end
				end
			end
			-- process collision
			if ohit!=nil 
			and o.f_coll!=nil
			then
				o.f_coll(o,ohit)
			end
			-- limit velocity
			o.vx=min(abs(o.vx),8)*sgn(o.vx)
			o.vy=min(abs(o.vy),8)*sgn(o.vy)
			-- move
			o.x+=o.vx
			o.y+=o.vy
			o.z+=o.vz
		end
		-- object-specific update
		if o.f_updt!=nil then
			o.f_updt(o)
		end
		-- check time to live
		--if o.ttl!=nil then
		--	o.ttl-=1
		--	if o.ttl<=0 then
		--		del(_objs,o)
		--	end
		--end
	end
end

function updt_acts()
	-- map tile in front of player
	local act_mapx,act_mapy=
		(_plr.x+cos(_plr.a)*8)\8,
		(_plr.y+sin(_plr.a)*8)\8
	for a in all(_acts) do
		if a.isa=="door" then
			if a.mapx==act_mapx
			and a.mapy==act_mapy
			and a.st8<1 -- closed/ing 
			then
				_act_text="🅾️ open"
				_act_txt2=a.txt
				if btn(🅾️) then
					a.st8=1 -- open door
					sfx(16,1)--a.snd)
				end
			end
			if a.st8==1 then
				-- opening
				a.pos-=0.5
				if a.pos<=0 then
					a.pos=0
					a.st8=2 -- fully open
					a.ttc=90 -- close in 3s
				end
			elseif a.st8==-1 then
				-- closing
				a.pos+=0.5
				if a.pos>=8 then
					a.pos=8
					a.st8=0 -- fully closed
				end
			elseif a.st8==2 then
				-- fully open
				a.ttc-=1
				if a.ttc<=0
				and not a.blk
				then
					a.st8=-1 -- close door
					sfx(17,1)--a.snd)
				end
				-- reset blocked flag
				a.blk=false
			end -- states
		end -- door
	end
end

function updt_cam()
	local cam,plr=_cam,_plr
	-- move camera to player
	cam.x,cam.y,cam.a=
		plr.x,plr.y,plr.a
	-- camera vector
	cam.vx,cam.vy=
		cos(cam.a),sin(cam.a)
	-- camera perpendicular
	cam.pvx,cam.pvy=
		-cam.vy,cam.vx
	-- player odometer
	-- for weapon bob
	_plr_odo+=plr.vx^2+plr.vy^2
	--plr.odo%=40
	--cam.z=4+0.25*sin(plr.odo/8)
end

function updt_hud()

end

function init_map_objs()
	for mapx=0,63 do
		for mapy=0,31 do
			local tile=mget(mapx,mapy)
			-- adjacent tiles
			local tile_left=
				mget(mapx-1,mapy)
			local tile_above=
				mget(mapx,mapy-1)
			-- actives
			if tile>=2 and tile<=5 then
				local a={
					x=mapx*8+4,
					y=mapy*8+4,
					mapx=mapx,
					mapy=mapy
				}
				-- doors
				if tile>=2 and tile<=5 then
					-- door
					-- states
					-- 0=closed
					-- 1=opening
					-- 2=open
					-- -1=closing
					a.isa="door"
					a.st8=0
					a.pos=8 -- 0=open 8=closed
					a.ttc=0 -- time to close
					a.blk=false -- blocked
					a.ssx=16+(tile-2)*8
					--a.snd=cel+12
					a.txt=""
				end
				-- add to actives
				add(_acts,a)
				_map2acts[mapx+mapy*128]=a
				-- use one of the
				-- adjacent tiles
				if fget(tile_left,0)
				then
					mset(mapx,mapy,tile_left)
				elseif fget(tile_above,0)
				then
					mset(mapx,mapy,tile_above)
				end
			else
				if tile<64 or tile>173
				then
					local o=init_obj(
						tile,
						mapx*8+4,
						mapy*8+4)
					if fget(tile_left,3)
					then
						mset(mapx,mapy,tile_left)
					elseif fget(tile_above,3)
					then
						mset(mapx,mapy,tile_above)
					end
				end
			end
		end
	end
end

-- check if coordinate
-- is a wall or a closed door
-- optionally block door
function is_wall(x,y)
	-- find map coordinate
	local mapx,mapy=x\8,y\8
	-- check for active
	local a=_map2acts[mapx+mapy*128]
	if a!=nil then
		-- is this a closed door?
		if a.isa=="door" then 
			-- block door from closing
			a.blk=true
			return a.st8!=2
		else
			-- all other actives
			return true
		end
	end
	-- regular tile
	-- check for floor 0
	return fget(mget(mapx,mapy),0)
end

-->8
-- graphics

function draw_clear()
	-- reset palette
	local scrpal=0
	-- red screen when hit
	if _plr.hp==0
	or time()<_scr_red_t
	then
		scrpal=1
	elseif time()<_scr_grn_t
	then
		scrpal=2
	end
	pal(_scrpal[scrpal],1)
	-- clear screen
	cls(0)
end

-- main raycaster function
function draw_walls()
	local cam,map2acts,perf=
		_cam,_map2acts,_perf
	for i=0,128 do
		_zbuf[i]=255
	end
	for scrx=0,127,perf do
		-- note: very sensitive
		local x,y=
			cam.x,cam.y
		local mapx,mapy=
			x\8,y\8
		-- ray
		local scrf=(scrx-64)/128
		local rayvx,rayvy=
			cam.vx+cam.pvx*scrf,
			cam.vy+cam.pvy*scrf
		local raydx,raydy=
			sgn(rayvx),
			sgn(rayvy)
		-- tile traversal based on
		-- amanatides and woo
		
		-- distance to travel
		-- across 1 tile
		local d4tx,d4ty=
			abs(8/rayvx),
			abs(8/rayvy)
		-- distance to travel
		-- to next tile boundary
		local d2x,d2y=
			(4+raydx*4-x%8)/rayvx,
			(4+raydy*4-y%8)/rayvy
		-- distance counter
		local d,dmax=0,80
		-- z-buffer
		_zbuf[scrx]=255
		
		-- floor 0 needs to be drawn
		local drawf0=true
		
		-- ceiling needs to be drawn
		-- (on this tile)
		local drawc=
			fget(mget(mapx,mapy),1)
		--[[if scrx==64 then 
			print(mapx .. " " .. mapy,32,32,9)
			print(mget(mapx,mapy),32,40,10)
			print(fget(mget(mapx,mapy),2),32,48,11)
			--pset(scrx,16,9)
		end]]--
		-- ceiling was drawn
		-- (on previous tile)
		local drewc=false
		-- last ceiling y
		local scryc0=-1
		-- half-step
		local half,halfisy=
			false,false
		-- doors
		local drawd,doorisy=
			false,false
		
		-- reset palette
		pal(_drwpal[0])
		
		-- perform step
		repeat
			-- is wall north-south?
			local wallisy
			-- dda step
			if d2x<d2y then
				d=d2x
				d2x+=d4tx
				wallisy=true
				mapx+=raydx
			else
				d=d2y
				d2y+=d4ty
				wallisy=false
				mapy+=raydy
			end
			-- half-step
			if half then
				if halfisy
				and wallisy
				then
					d2x-=d4tx/2
					mapx-=raydx
				elseif not halfisy
				and not wallisy
				then
					d2y-=d4ty/2
					mapy-=raydy
				end
				half=false
			end
			--debug
			--pset(mapx*8+4,mapy*8+4,11)
						
			-- map tile
			local tile=mget(mapx,mapy)
			
			-- draw ceiling
			if drawc 
			and drawf0
			then
				local scryc=
					min(ceil(64-4/d*128),57)
				-- normal color
				line(scrx,scryc0,
					scrx,scryc,
					5)
				-- darker
				if scryc>=52 then
					line(scrx,max(scryc0,52),
						scrx,scryc,
						2)
				end
				-- darkest
				if scryc>=56 then
					line(scrx,max(scryc0,56),
						scrx,scryc,
						1)
				end
				-- do not draw above
				-- ceiling
				poke(0x5f21,max(0,scryc))
				scryc0=scryc
				-- do not draw ceiling
				-- (will be set later)
				drawc=false
				-- mark ceiling as drawn
				drewc=true
			end
			
			-- draw walls
			if tile>=64 and tile<192 
			then
				--debug
				--rect(mapx*8,mapy*8,
				--	mapx*8+7,mapy*8+7,
				--	12)
				-- active on this tile
				local act=
					map2acts[mapx+mapy*128]
				
				-- set palette
				local p=max(d-20,0)\20
				pal(_drwpal[p])
				
				-- get texture column
				local wallcol=(wallisy
					and (y+d*rayvy)
					or (x+d*rayvx))
					%8*2
				if (wallisy and raydx<0) 
				or (not wallisy and raydy>0)
				then
					wallcol=16-wallcol
				end
				-- get texture
				local ssx,ssy=
					tile%16*8,
					tile\32*16
				-- base tex for doorway
				-- texture x
				if fget(tile,4) then
					-- mirror first 8 pixels
					ssx=ssx+8-abs(8-wallcol)
				else
					-- loop first 8 pixels
					ssx=ssx+wallcol%8
				end
				
				-- coordinates
				-- height of floor 1
				local scrhf0=
					flr(8/d*128)\2*2
				-- y-position of floor 1
				local scryf0=
					64-scrhf0\2
				
				-- floor 0 (ground)
				-- need to draw floor 0
				-- and tile has floor 0
				-- and no actives
				if drawf0
				and fget(tile,0)
				and not act
				then
					-- debug
					--line(scrx,scry0,
					--	scrx,scry0+scrh0+1,
					--	7+wallcol%8)
					sspr(ssx,ssy,
						1,16,
						scrx,scryf0,
						perf,scrhf0+1)
					
					-- set z-buffer
					_zbuf[scrx]=d
					
					if drewc then
						-- floor 0 and
						-- ceiling drawn
						-- nothing to do
						break
					end
					
					-- do not draw floor 0
					-- anymore
					drawf0=false
					-- do not draw
					-- below top of wall
					poke(0x5f23,max(0,scryf0))
					-- do not draw
					-- far behind low wall
					dmax=min(d*4,dmax)
				end
				
				-- door
				-- need to draw floor 0
				-- and has an active
				if drawf0
				and act
				and act.isa=="door"
				--and act.st8<2
				then
					-- draw door on middle
					-- of the tile
					if drawd then
						drawd=false
						local door=act
						-- draw the door part
						-- not the gap
						-- dist between
						-- column and edge
						local c2e=
							8-abs(8-wallcol)
						if c2e<door.pos 
						then
							local ssx,ssy=
								door.ssx,0
							local drawcol=
								c2e+8-door.pos
							sspr(ssx+drawcol,ssy,
								1,16,
								scrx,scryf0,
								perf,scrhf0+1)
							
							-- set z-buffer
							_zbuf[scrx]=d
							
							if drewc then
								-- floor 0 and
								-- ceiling drawn
								-- nothing to do
								break
							end
							
							-- do not draw flr 0
							-- anymore
							drawf0=false
							-- do not draw
							-- below top of wall
							poke(0x5f23,max(0,scryf0))
							-- do not draw
							-- behind low wall
							--dmax=min(d*4,dmax)
						end
					else
						-- move only half
						-- of tile and
						-- draw door on next
						-- step
						half,halfisy=
							true,wallisy
						drawd,doorisy=
							true,wallisy
						if halfisy then
							d2x-=d4tx/2
						else
							d2y-=d4ty/2
						end
					end
				end
				
				-- floor 1 (upper)
				-- if ceiling was not
				-- yet drawn
				if fget(tile,1) then 
					if not drewc
					then
						-- find texture for
						-- upper floor 
						local texf1=
							(fget(tile)&0x60)>>5
						local ssx,ssy=
							ssx\32*32+8*texf1+ssx%8,
							32
						local scryf1=
							ceil(64-12/d*128)
						local scrhf1=
							scryf0-scryf1
						sspr(ssx,ssy,
							1,16,
							scrx,scryf1,
							perf,scrhf1)
						-- extra floors
						--[[for i=1,3 do
							local scryfx=
								scryf1-scrhf1*i
							sspr(ssx,ssy,
								1,16,
								scrx,scryfx,
								perf,scrhf1)
						end]]--
					end
						
					-- if floor 0 still
					-- needs to be drawn
					-- it is an underpass
					if drawf0 then
						-- underpass
						-- do not draw above
						poke(0x5f21,max(0,scryf0))
						-- draw ceiling
						-- on next step
						drawc=true
						-- reset palette
						-- for proper ceil
						-- colors
						pal(_drwpal[0])
					else
						-- all floors drawn 
						-- nothing to do
						break
					end
				end
			end
			-- ceilings
			-- applies on next step
			drawc=
				drawc or fget(tile,1)
			drewc=false
		until d>dmax
		if perf==2 then
			_zbuf[scrx+1]=_zbuf[scrx]
		end
		-- reset clip rectangle
		poke(0x5f21,0)
		poke(0x5f23,128)
	end
end

function draw_floor()
	pal(_drwpal[0])
	-- do not draw transparency
	palt(0,false)
	-- plain floor
	rectfill(0,70,127,72,1)
	rectfill(0,73,127,77,2)
	rectfill(0,78,127,127,5)
	-- tiles
	local cam=_cam
	-- precalc vectors
	local vx0,vy0,vx1,vy1=
		cam.vx-cam.pvx*0.5,
		cam.vy-cam.pvy*0.5,
		cam.vx+cam.pvx*0.5,
		cam.vy+cam.pvy*0.5
	-- darker palette
	pal(_drwpal[1])
	-- from the center out
	for i=9,64,_perf do
		if i==15 then
			-- set the light palette
			pal(_drwpal[0])
		end
		local d=128*4/i
		local x0,y0,x1,y1=
			cam.x+vx0*d,
			cam.y+vy0*d,
			cam.x+vx1*d,
			cam.y+vy1*d
		--pset(x0,y0,12)
		--pset(x1,y1,14)
		local scry=64+i
		--line(0,scry0,127,scry0,6)
		tline(0,scry,127,scry,
			x0/8,
			y0/8,
			(x1-x0)/8/128,
			(y1-y0)/8/128,
			0x08)
		-- duplicate row
		if _perf==2 then
			memcpy(0x6000+scry*64-64,
				0x6000+scry*64,64)
		end
	end
end

function draw_objs()
	local objs,cam,zbuf=
		_objs,_cam,_zbuf
	-- draw transparency
	palt()
	-- calculate distance to cam
	for o in all(objs) do
		-- delta distances to cam
		o.dvx=o.x-cam.x
		o.dvy=o.y-cam.y
		-- project vector to obj
		-- onto camera unit vector
		o.d2cam=
			o.dvx*cam.vx+o.dvy*cam.vy
	end
	-- bubble sort
	--repeat
		--local done=true
		for i=1,
		#objs-1 do
			local o1,o2=objs[i],objs[i+1]
			if o1.d2cam<o2.d2cam then
				objs[i],objs[i+1]=o2,o1
				--done=false
			end
		end
	--until done
	-- draw sprites
	for o in all(objs) do
		local dist=o.d2cam
		if dist>1 and dist<80
		and o.h>0 and o.w>0
		then
			local real2scr=dist/128
			-- sprite size on screen
			local scrh=
				ceil(o.h/real2scr)
			local scrw=
				ceil(o.w/real2scr)
			-- project vector to obj
			-- onto screen x vector
			-- (perpendicular to cam)
			local px=
				o.dvx*cam.pvx
				+o.dvy*cam.pvy
			-- x position on screen
			local scrx=ceil(64
				+px/real2scr
				-scrw/2)
			-- draw only if on screen
			if scrx>-scrw and scrx<128
			then
				-- clip from sides
				local xl,xr,vc,vp,va=
					max(0,scrx-4),
					min(128,scrx+4+scrw),
					false,
					false,
					false
				for xx=xl,xr do
					vp,vc=vc,dist<zbuf[xx]
					if vc and not vp then
						xl=xx
						va=true
					end
					if not vc and vp then
						xr=xx
						break
					end
				end
				--print(xl,scrx,32,12)
				--print(xr,scrx+scrw,39,12)
				if va -- visible any
				then
					-- top of the sprite
					local scry=
						ceil(64-(o.z+o.h-4)/real2scr)
					-- clip
					poke(0x5f20,xl)
					poke(0x5f22,xr)
					pal(_drwpal[max(0,dist-20)\20])
					-- draw a special sprite
					-- if defined
					if o.f_draw!=nil then
						o.f_draw(o,scrx,scry,scrw,scrh)
					else
						sspr(o.ssx,o.ssy,
							o.ssw,o.ssh,
							scrx,scry,
							scrw,scrh)
					end
					-- unclip
					poke(0x5f20,0)
					poke(0x5f22,128)
				end -- va
			end
		end
	end
end

function draw_hud(plr)
	-- draw weapon + hud
	pal(_drwpal[0])
	-- weapon info and sprite
	local wpn,wssx0,wssx1,wflip=
		_wpndef[plr.wpn],0,0,true
	-- weapon bob
	local wxo=
		sin(_plr_odo/32)*2
	local wyo=
		sin(time()/3)
		+sin(_plr_odo/8)*1
	-- weapon switch
	if time()<_plr_wpn_next_t
	then
		wyo+=32-min(32,
			abs(time()-_plr_wpn_next_t+0.5)
			/0.4*32)
	end
	-- muzzle flash
	-- for specific weapons
	if time()<_plr_wpn_mfl_t 
	and _plr_wpn<=3
	then
		if _plr_wpn==1 then
			-- blue for gauss pistol
			pal(9,15)
			pal(10,12)
		--elseif _plr_wpn==3 then
			-- red for plasmagun
		--	pal(9,3)
		--	pal(10,11)
		end
		-- double flash for shotgun
		local mfw=
			_plr_wpn==2 and 8 or 6
		-- draw
		sspr(0,96,mfw,8,
			65-mfw*2+wxo,86+wyo,
			mfw*2,16)
		sspr(0,96,mfw-1,8,
			65+wxo,86+wyo,
			mfw*2-2,16,true)
	end
	-- weapon
	pal(_drwpal[0])
	if _plr_wpn==1 then
		-- gauss pistol
		wssx0,wssx1,wflip=0,8,false
	elseif _plr_wpn==2 then
		-- shotgun
		wssx0,wssx1=16,16
		if time()<_plr_wpn_rdy_t
		and time()>_plr_wpn_next_t
		then
			wyo+=32-min(32,
				abs(time()-_plr_wpn_rdy_t+0.75)
				/0.4*32)
			if wyo>4 then
				wssx0,wssx1=24,24
			end
		end
		--local ttr=
		--	max(0,_wlwr_t-time())
		--if ttr>0 and ttr<=1 then
		--	wyo+=-32*sin(ttr/2)
		--end
	elseif _plr_wpn==3 then
		-- gatling
		local s=flr(_plr_wpn_gg_s)
		wssx0,wssx1=
			32+8*s,32+8*s
		if s==1 or s==3 then
			wssx1=32+8*(4-s)
		end
	elseif _plr_wpn==4 then
		-- flamethrower
		wssx0,wssx1,wflip=64,64,true--false
		-- draw pilot light
		if time()>_plr_wpn_mfl_t then
			sspr(24+4*flr(time()*8%2),96,
				4,8,
				60+wxo,84+wyo,
				8,16,time()*4%2<1)
		-- port glow
		--pal(9,9+time()*8%2)
		end
	elseif _plr_wpn==5 then
		-- rocket launcher
		local rls=72+8*min(2,
			max(0,_plr_wpn_rdy_t-time())
			\0.25)
		wssx0,wssx1=rls,rls
	end
	-- draw the weapon
	-- with recoil
	local rcl=flr(_plr_wpn_rcl)
	sspr(wssx0,80,8,16,
		49+wxo-rcl,98+wyo+rcl,
		16+rcl,32+rcl)
	sspr(wssx1,80,7,16,
		65+wxo,98+wyo+rcl,
		14+rcl,32+rcl,wflip)
		
	-- health
	local str_life=
		"\^w♥" .. 
		(plr.hp<100 and " " or "") .. 
		(plr.hp<10 and " " or "") ..
		plr.hp
	local col_life=11
	--[[if (time()<plr.hit_t
	or plr.hp<=20)
	and time()*4%2<1 
	 then
		col_life=7
	end]]--
		print(str_life,3,121,0)
		print(str_life,2,120,col_life)
	-- money
	--print("\^w$" .. g_plr.money,93,121,0)
	--print("\^w$" .. g_plr.money,92,120,11)	
	-- ammo
	if _plr_wpn!=1 then
		local str_ammo=
			"\^w▥" .. 
			(_plr_wpn_ammo<100 and " " or "") .. 
			(_plr_wpn_ammo<10 and " " or "") ..
			_plr_wpn_ammo
		print(str_ammo,87,121,0)
		print(str_ammo,86,120,10)	
	end
	
	--[[for i=1,plr.ammo do
		print("\^w!",85+i*3,121,0)
		print("\^w!",84+i*3,120,10)
	end]]--
	-- console message
	if time()<_msg_time then
		print("\^w".._msg_text,1,1,7)
	end
	-- action message
	local tx=64-#_act_text*4
	print("\^w".._act_text,tx+1,73,0)
	print("\^w".._act_text,tx,72,7)
	_act_text=""
	local t2x=64-#_act_txt2*4
	print("\^w".._act_txt2,t2x+1,80,0)
	print("\^w".._act_txt2,t2x,79,7)
	_act_txt2=""
	-- console message
	print(_msg_text,1,1,7)
	
	
	-- reticle
	--line(52,64,56,64,7)
	--line(72,64,76,64,7)
	--line(64,68,64,128,9)
	
end
-->8
-- object-specific functions

-- generic humanoid enemy
function updt_hmnd(o)
	-- vector to player
	local v2plrx,v2plry=
		_plr.x-o.x,
		_plr.y-o.y
	-- distance to player
	local d2plr=
		sqrt(v2plrx^2+v2plry^2)
	-- angle to player
	local a2plr=
		atan2(v2plrx,v2plry)
	-- enemy states
	-- 0 = wait
	-- stand and waits
	-- 1 = move
	-- move to the destination
	-- while waiting or moving,
	-- enemy periodically
	-- "thinks", i.e.
	-- checks if it sees player,
	-- changes walk destination, 
	-- or aims at player
	-- 2 = aim
	-- stop and aim at player
	-- different sprite informs 
	-- player about the attack
	-- enemy does not "think"
	-- in this state
	-- 3 = attack
	-- repeatedly attack player
	-- can be single attack or
	-- a volley
	-- after attack, enemy needs
	-- to cool down before next
	-- attack
	-- once done, goes to "wait"
	-- enemy does not "think"
	-- in this state
	-- 4 = hit
	-- enemy was hit by player
	-- different sprite or tint
	-- informs player of hit
	-- this state interrupts aim
	-- or attack state
	-- once done, goes to "wait"
	-- 6 = death
	-- enemy was killed
	if time()>o.st8_t then
		if o.st8<=1 then
			-- waiting or walking
			-- if ready to attack
			-- aim at player
			if d2plr<32 
			and time()>o.rdy_t then
				-- aim
				o.st8=2
				o.st8_t=time()+o.aim_l
				o.vx=0
				o.vy=0
			else
				-- move to a random place
				-- between self and player
				o.dstx,o.dsty=
					o.x-32+rnd(64),
					o.y-32+rnd(64)
					--g_plr.x-v2plrx*32/d2plr,
					--g_plr.y-v2plry*32/d2plr
				--o.proc_t=time()+1
				o.st8=1
				o.st8_t=time()+rnd(2)
			end
		elseif o.st8==2 then
			-- currently aiming
			-- fire at player
			o.st8=3
			o.st8_t=time()+o.atk_l
			o.rdy_t=time()+o.rdy_l
		elseif o.st8==3 then
			o.st8=0
		elseif o.st8==4 then
			o.st8=0
		elseif o.st8==6 then
		end
	end
	-- handle each state
	-- vector to destination
	if o.st8==1 then
		local v2dstx,v2dsty=
			o.dstx-o.x,
			o.dsty-o.y
		local d2dst=
			sqrt(v2dstx^2+v2dsty^2)
		if d2dst<1 then
			-- at a destination
			-- wait until next think
			o.vx,o.vy=0,0
		else
			-- move to destination
			o.vx,o.vy=
				v2dstx/d2dst*0.15,
				v2dsty/d2dst*0.15
		end
	elseif o.st8==3 then
	end
	
	-- test
	--[[if d2plr<32 then
		o.st8=2
		o.vx=0
		o.vy=0
	else
		o.st8=1
		o.vx=cos(a2plr)*0.25
		o.vy=sin(a2plr)*0.25
	end]]--
end

function draw_hmnd(o,scrx,scry,scrw,scrh)
	-- draw two halves separately
	local scrx0,scrx1,scrwh,step=
		flr(scrx),
		flr(scrx+scrw/2),
		ceil(scrw/2),
		4*(time()+o.seed)%2<1
	local spr0,spr1=0,1
	if o.st8>1 then
		-- aim or fire
		spr0,spr1=0,2
	elseif step and o.st8==1 then
		-- wait or walk
		spr0,spr1=1,0
	end
	-- set the palette
	if o.st8==4
	and time()<o.st8_t
	then
		--spr0,spr1=1,1
		pal(_drwpal[4])
	end
	--pal(11,sget(10,)
	--pal(3,9)
	-- draw the position
	sspr(16+spr0*8,104,8,24,
		scrx0,scry,scrwh,scrh)
	sspr(16+spr1*8,104,8,24,
		scrx1,scry,scrwh,scrh,true)
	-- weapon
	if o.st8>1 then
		sspr(123,80,5,4,
			scrx0+flr(4/16*scrw),
			scry+flr(10/24*scrh),
			ceil(5/16*scrw),
			ceil(4/24*scrh)
		)
	else
		local relx_wpn=
			spr0==0 and 7 or 5
		sspr(112,80,10,4,
			scrx0+flr(relx_wpn/16*scrw),
			scry+flr(12/24*scrh),
			ceil(10/16*scrw),
			ceil(4/24*scrh)
		)
	end
	-- debug
	local txts={
		[0]="wait",
		"move",
		"aim",
		"fire",
		"ouch",
		"died"}
	print(txts[o.st8],scrx,scry-6,7)
end

-- generic shot
-- damage enemies
-- destroy on collision
function coll_shot(o,oo)
	if oo!=0 
	and ((o.t=="a" and oo.t=="e")
	or (o.t=="b" and oo.t=="p"))
	then
		dmg_obj(oo,o.dmg)
	end
	del(_objs,o)
	--[[for i=1,10 do
	init_eff(
		o.x,
		o.y,
		o.z+1,
		-0.5+rnd(1),
		-0.5+rnd(1),
		-0.5+rnd(1),
		0.4,
		10,
		10+flr(rnd(10))
	)
	end]]--
end

function draw_bolt(o,scrx,scry,scrw,scrh)
	local t=time()+o.seed
	sspr(32,96,
		8,8,
		scrx,scry,
		scrw,scrh,
		t*12%2<1,
		t*6%2<1)
end

function updt_fire(o)
	-- grow
	--o.w+=0.2
	--o.h+=0.2
	-- check time to live
	if o.ttl!=nil then
		o.ttl-=1
		if o.ttl<=0 then
			del(_objs,o)
		end
	end
end

function draw_fire(o,scrx,scry,scrw,scrh)
	local t=time()+o.seed
	sspr(56,96,--0+8*flr(t*6%2),16,
		8,8,
		scrx,scry,
		scrw,scrh,
		t*12%2<1)
end

function draw_big_fire(o,scrx,scry,scrw,scrh)
	local t=time()+o.seed
	sspr(0+8*flr(t*6%2),16,
		8,16,
		scrx,scry,
		scrw,scrh,
		t*12%2<1)
end
-->8
-- player & controls

-- movement variables
_plr_move_max=0.65
_plr_move_acc=0.3
_plr_move_dec=0.1
_plr_turn_max=0.01
_plr_turn_acc=0.002
_plr_turn_dec=0.001
_plr_odo=0
-- weapon variables
_plr_wpn=0
_plr_wpn_ammo=6
_plr_wpn_rdy_t=1
_plr_wpn_next=1
_plr_wpn_next_t=0.5
_plr_wpn_mfl_t=0
_plr_wpn_rcl=0
_plr_wpn_gg_s=0
_plr_wpn_gg_v=0

function updt_plr()
	local plr=_plr
	
	-- movement
	-- slow down 
	local plr_spd=
		sqrt(plr.vx^2+plr.vy^2)
	if plr_spd>0 then
		-- deceleration factor
		local decf=
			max(0,plr_spd-_plr_move_dec)
			/plr_spd
		plr.vx*=decf
		plr.vy*=decf
	end
	-- slow down turning
	plr.va=slow(plr.va,_plr_turn_dec)
	
	-- process buttons
	if btn(⬆️) then
		plr.vx+=
			cos(plr.a)*_plr_move_acc
		plr.vy+=
			sin(plr.a)*_plr_move_acc
	end
	if btn(⬇️) then
		plr.vx+=
			cos(plr.a+0.5)*_plr_move_acc
		plr.vy+=
			sin(plr.a+0.5)*_plr_move_acc
	end
	if btn(⬅️) then
		if btn(🅾️) then
			plr.vx+=
				cos(plr.a+0.25)*_plr_move_acc
			plr.vy+=
				sin(plr.a+0.25)*_plr_move_acc
		else
			plr.va+=_plr_turn_acc
		end
	end
	if btn(➡️) then
		if btn(🅾️) then
			plr.vx+=
				cos(plr.a-0.25)*_plr_move_acc
			plr.vy+=
				sin(plr.a-0.25)*_plr_move_acc
		else
			plr.va-=_plr_turn_acc
		end
	end
	if btn(❎) then
		if time()>_plr_wpn_rdy_t
		then
			plr_fire(plr)
		end
	end
	
	-- limit move speed
	plr_spd=
		sqrt(plr.vx^2+plr.vy^2)
	-- factor of max speed
	local maxf=
		plr_spd/_plr_move_max
	if maxf>1 then
		plr.vx/=maxf
		plr.vy/=maxf
	end
	-- limit turn speed
	plr.va=min(
			abs(plr.va),
			_plr_turn_max
		)
		*sgn(plr.va)
	-- turn player
	plr.a+=plr.va
	-- limit angle
	plr.a%=1
	
	-- pickups
	for oo in all(_objs) do
		if oo!=plr
		and oo.t=="i"
		and abs(plr.x-oo.x)<3
		and abs(plr.y-oo.y)<3
		then
			if oo.hp!=nil 
			and plr.hp<100 then
				plr.hp=
					min(100,plr.hp+oo.hp)
				_scr_grn_t=time()+0.2
				sfx(20,1)
				del(_objs,oo)
			elseif oo.wpn!=nil 
			and _plr_wpn_next==1
			then
				_plr_wpn_next_t=time()+1
				_plr_wpn_rdy_t=_plr_wpn_next_t
				_plr_wpn_next=oo.wpn
				_plr_wpn_ammo=oo.ammo
				--_plr_wpn_ammo=4
				sfx(21,1)
				_msg_text=oo.msg
				del(_objs,oo)
			end
		end
	end
	
	-- weapon
	-- switch to another weapon
	-- at the bottom
	if time()>_plr_wpn_next_t-0.5
	then
		_plr_wpn=_plr_wpn_next
	end
	-- recoil
	_plr_wpn_rcl=
		max(0,_plr_wpn_rcl-0.75)
	-- gatling gun animation
	_plr_wpn_gg_s+=_plr_wpn_gg_v
	_plr_wpn_gg_s%=4
	-- spin down
	if time()>_plr_wpn_rdy_t 
	and _plr_wpn_gg_v>0 then
		_plr_wpn_gg_v=
			max(0,_plr_wpn_gg_v-0.01)
	end
end

function plr_fire(plr)
	local wpn=_wpndef[_plr_wpn]
	local shots=
		_plr_wpn==2 and 7 or 1
	for i=1,shots do
		local a=plr.a
		local shot=init_obj(
			wpn.def,
			plr.x+cos(a)*4,
			plr.y+sin(a)*4
		)
		-- fan out multiple shots
		a=plr.a-0.04
			+(i-0.5)/shots*0.08
		-- add spread
		a+=rnd(wpn.asp*2)-wpn.asp
		shot.vx=cos(a)*wpn.spd
		shot.vy=sin(a)*wpn.spd
		shot.vz=sin(rnd(wpn.asp*2)-wpn.asp)
		shot.t="a"
		shot.dmg=wpn.dmg
	end
	sfx(7+_plr_wpn,2)
	if _plr_wpn==2
	and _plr_wpn_ammo>2
	then
		sfx(13,1)
	end
	-- reload
	_plr_wpn_rdy_t=time()+wpn.rof
	-- muzzle flash animation
	_plr_wpn_mfl_t=time()+0.1
	-- recoil
	if _plr_wpn<=2 then
		_plr_wpn_rcl=4
	end
	if _plr_wpn==3 then
		-- reset gatling gauss
		_plr_wpn_gg_s=0
		_plr_wpn_gg_v=0.5
	end
	-- handle ammo runout
	_plr_wpn_ammo-=
		_plr_wpn==2 and 2 or
		_plr_wpn==1 and 0 or 1
	if _plr_wpn!=1
	and _plr_wpn_ammo<=0
	then
		_plr_wpn_next_t=time()+1
		_plr_wpn_rdy_t=_plr_wpn_next_t
		_plr_wpn_next=1
		_msg_text="oUT OF AMMO!"
	end
end

--[[function coll_plr(plr,oo)
	if oo!=0 and oo.dmg!=nil then
		dmg_obj(plr,oo.dmg)
	end
end]]--

--g_plr.f_coll=coll_plr
-->8
-- delme game object graphics


function draw_zomb(o,scrx,scry,scrw,scrh)
	sspr(0,104,15,24,
		scrx,scry,scrw,scrh,
		(2*(time()+o.seed)%2<1 
			and true or false)
	)
	--[[if o.time_inv>time() then
		print("ouch",scrx,scry-6,8)
	else
		print(o.hp,scrx,scry-6,7)
	end]]--
end
--[[
function draw_cult(o,scrx,scry,scrw,scrh)
	-- debug
	if btn(🅾️) then
		o.st8=2
	else
		o.st8=1
	end
	local scrx0,scrx1,scrwh,step=
		flr(scrx),
		flr(scrx+scrw/2),
		ceil(scrw/2),
		2*(time()+o.seed)%2<1
	local spr0,spr1=0,1
	if o.st8>1 then
		-- aim or fire
		spr0,spr1=0,2
	elseif step then
		-- walk
		spr0,spr1=1,0
	end
	pal(11,10)
	pal(3,9)
	-- draw the position
	sspr(16+spr0*8,96,8,24,
		scrx0,scry,scrwh,scrh)
	sspr(16+spr1*8,96,8,24,
		scrx1,scry,scrwh,scrh,true)
	-- weapon
	if o.st8>1 then
		sspr(48,72,7,4,
			scrx0+flr(4/16*scrw),
			scry+flr(10/24*scrh),
			ceil(7/16*scrw),
			ceil(4/24*scrh)
		)
	else
		local relx_wpn=
			spr0==0 and 7 or 5
		sspr(48,64,10,8,
			scrx0+flr(relx_wpn/16*scrw),
			scry+flr(12/24*scrh),
			ceil(10/16*scrw),
			ceil(8/24*scrh)
		)
	end
end]]--

--[[function draw_dron(o,scrx,scry,scrw,scrh)
	sspr(16,8,16,8,
		scrx,
		scry+sin(time()+o.seed)*2,
		scrw,
		scrh,
		(16*time()%2<1 
			and true or false)
	)
end]]--

--[[function draw_bot(o,scrx,scry,scrw,scrh)
	local w12=ceil(scrw/2)
	local w14=ceil(scrw/4)
	local h23=ceil(scrh*0.6667)
	local h13=ceil(scrh*0.3333)
	local ani=flr(time()*8%3)
	local ani2=flr(time()*8%4)
	--rectfill(scrx,scry+scrh-4,scrx+scrw,scry+scrh-1,0)
	--sspr(0,8,8,16,
	--	scrx,scry,w12,h23)
	--sspr(0,8,8,16,
	--	scrx+scrw\2,scry,w12,h23,true)
	-- siren
	sspr(24+4*ani2,16,4,8,
		scrx+scrw*6\16,scry,w14,h13)
	-- body
	sspr(16,16,8,8,
		scrx+scrw/16*6,scry+h13,w12,h13)
	-- tracks
	sspr(16+8*ani,24,8,8,
		scrx,scry+h23,w12,h13)
	sspr(16+8*ani,24,8,8,
		scrx+w12,scry+h23,w12,h13,true)
end]]--


-->8
-- delme effects

--[[function init_eff(x,y,z,vx,vy,vz,g,r,c,ttl,ani)
	local eff={
		x=x,
		y=y,
		z=z,
		vx=vx,
		vy=vy,
		vz=vz,
		g=g,
		r=r,
		c=c,
		ttl=ttl,
		ani=ani
	}
	add(g_effs,eff)
end

function eff_any(o,v,g,ttl,rttl,ani)
	local a=atan2(
		g_cam.x-o.x,
		g_cam.y-o.y)
	-- vector to camera
	local vcx,vcy=
		cos(a),sin(a)
	-- vector to the right
	local vrx,vry=
		cos(a+0.25),sin(a+0.25)
	for xx=0,o.ssw-1 do
		for yy=0,o.ssh-1 do
			--if rnd(2)<1 then
			local c=sget(
				o.ssx+xx,
				o.ssy+yy)
			if c!=0 then
				local rndy=0--rnd(1)-0.5
				local x=o.x
					+(xx/o.ssw-0.5)*o.w*vrx
					+rndy*o.w*vcx
				local y=o.y
					+(xx/o.ssw-0.5)*o.w*vry
					+rndy*o.w*vcy
				init_eff(
					x,
					y,
					o.h-yy/4,
					-v/2+rnd(v),
					-v/2+rnd(v),
					-v/2+rnd(v),
					g,
					0.1,
					c,
					ttl+rnd(rttl),
					ani
				)
			end
			--end
		end
	end
end

function eff_beam_die(o)
	eff_any(o,
		0,
		-0.005,
		20,
		30,
		1
	)
end

function eff_collapse(o)
	eff_any(o,
		0.02,
		-0.01,
		20,
		10,
		1
	)
end

function eff_expl_die(o)
	eff_any(o,
		0.4,
		-0.01,
		30,
		30,
		2
	)
end


function draw_effs(effs,cam,zbuf)
	pal(g_pals[0])
	for e in all(effs) do
		-- move the particle
		e.x+=e.vx
		e.y+=e.vy
		e.z=max(0,e.z+e.vz)
		e.vz+=e.g
		-- destroy if time
		e.ttl-=1
		if e.ttl<=0 then
			del(effs,e)
		end
		-- color animation
		if e.ani>0 and e.ttl<24 then
			e.c=sget(
				7-e.ttl\3,
				7+e.ani)
		end
		-- delta distances to cam
		e.dvx=e.x-cam.x
		e.dvy=e.y-cam.y
		-- project vector to obj
		-- onto camera unit vector
		local dist=
			e.dvx*cam.vx
			+e.dvy*cam.vy
		if dist>1 and dist<100
		then
			-- sprite size on screen
			local scrs=e.r/dist*128
			-- project vector to obj
			-- onto screen x vector
			-- (perpendicular to cam)
			local px=
				e.dvx*cam.pvx
				+e.dvy*cam.pvy
			-- x position on screen
			local scrx=64
				+px/dist*128
			-- draw only if on screen
			if scrx>=0 and scrx<128
			and dist<zbuf[flr(scrx)]
			then
				local scry=64
					-(e.z-4)/dist*128
				rectfill(
					scrx-scrs,
					scry-scrs,
					scrx+scrs,
					scry+scrs,
					e.c)
				--if scrs<=0.75 then
				--	pset(scrx,scry,e.c)
				--else
				--	circfill(scrx,scry,scrs,e.c)
				--end
			end
		end
	end
end]]--

__gfx__
0123456789abcdef6666666644444444666666663333333300000000000000000000000000000000000000000009000000aaaa00006d20000000000000000000
001212574493f28260000006411111146dddddd6222222230000000000000000000000000000000000000000000940000aa77aa0006d20000000000000000000
00010127114221416000000649444414671111d6333333b3000000000000000000000000000000000000000000099000aa7aaaa900aa90000000000000000000
00000016001110106000000649444414672222d666b333b3000000000000000000000000000000000000000000094100a7aaaaa900aa90000000000000000000
014888ee88eee8e86000000649444414671111d6dd2333b3000000000000000000000000000000000000000000099400aaaaaaa90aaaa9000000000000000000
012333bb33bbb3b36000000649444414672222d63333bbb3000000000000000000000000000000000000000009149400aaaaaaa90a7aaa000000000000000000
012fffccffcccfcf6000000649444414671111d63333b3330000000000000000000000000000000000000000944141000aaaaa900aa7aa000000000000000000
00000000000000006000000649444414672222d63333b36600000000000000000000000000000000000000000411410000aaa90000aaa0000000000000000000
00521000000000006000000649999914677777d63333b3dd00000000000000000000000000000000000000000149410000d6d200000000000000000000000000
7a941000000000006222226644444d64666666663333b3330000000000000000000000000000000000000000001949110d676d20000000000000000000000000
7e84100000a0600060000066444442d46666dd76333322230000000000000000000000000000000000000000009449410d676d20000000000000000000000000
7b3210000090d50062222266411111146666666666b333b300000000000000000000000000000000000000000099441000d6d200000000000000000000000000
76d2100000412fc0600000064944441466666666dd2333b300000000000000000000000000000000000000000094941000d6d200000000000000000000000000
7cf2100000803000600000064944441466666666333333b300000000000000000000000000000000000000000099410000d6d200000000000000000000000000
0000000000e0b000600000064999999466666666bbbbbbb300000000000000000000000000000000000000009494410000d6d200000000000000000000000000
00000000000000006666666644444444666666663333333300000000000000000000000000000000000000009941100000d6d200000000000000000000000000
00e00000000000006666666611116666444444442255225500000000000000000000000000000000000000009494100000d6d200000000000000000000000000
00e00000000090003333333311116666199991112255225500000000000000000000000000000000000000000941100000d6d200000000000000000000000000
00a9000000009e00333aa33311116666994444995522552200000000000000000000000000000000000000000994100000d6d200000000000000000000000000
00a90000000ea90033aaaa3311116666111999915522552200000000000000000000000000000000000000000941491000d6d200000000000000000000000000
009ae0000009a9003aaaaaa366661111111144442255225500999999999999000000000000000000000000000994991100d6d200000000000000000000000000
009aa9000009aae0333aa33366661111944449992255225599999999999999990000000000000000000000000094499400d6d200000000000000000000000000
0eaaa900009a7a90333aa333666611114411114455225522dd999999999999dd0000000000000000000000000099441000d6d200000000000000000000000000
0ea7a9e0009a7aa03333333366661111999111195522552200d6666ddddddd000000000000000000000000000094410000d6d200000000000000000000000000
0aa7aa900eaa77a922222222dddd6666000000002255220000000004200000000000000000000000000000000099410000d6d200000000000000000000000000
0a777a9e0ea777aa21222221dddd6666000000002255220000000004200000000000000000000000000000000094110000d6d200000000000000000000000000
ea7777a9e9a777a922221222dddd6666000000000022552200000004200000000000000000000000000000000099441000d6d200000000000000000000000000
aa7777a99a7777a922222222dddd6666000000000022552200000004200000000000000000000000000000000994411000d6d200000000000000000000000000
9777777a9777777e222222226666dddd00000000225500550000000420000000000000000000000000000000094944100d676d20000000000000000000000000
9777777ae777777e222212126666dddd000000002255005500000dd42dd00000000000000000000000000000099441100d676d20000000000000000000000000
0977777909777790122222226666dddd000000005522552200006ddddddd0000000000000000000000000000994949410d676d20000000000000000000000000
0a7777900a7777e0222222226666dddd000000005522552200000666ddd00000000000000000000000000000949444110d676d20000000000000000000000000
88888888888888884444444444444444eeeeeee8eeeeeee8ddddddddaaaaaaa90000000000000000000000000000000000000000000000000000000066666666
eee8eee8eee8eee89994999499949994e8888884e8888884dddddddda99999940000000000000000000000000000000000000000000000000000000062222222
88888888888888884444444446666666e8888884e888888422222222a99999940000000000000000000000000000000000000000000000000000000065666665
e8eee8eee8eee8ee94999499960060068444444484444444dddddddd944444440000000000000000000000000000000000000000000000000000000065566655
88888888886666884444444446006006eee8eeeeeee8eeeeddd6ddddaaa9aaaa0000000000000000000000000000000000000000000000000000000065522255
eee8eee8ee6006e899949994960060068884e8888884e888dddd2ddd9994a9990000000000000000000000000000000000000000000000000000000065222225
888888888860068844444444460060068884e8888884e888dddddddd9994a9990000000000000000000000000000000000000000000000000000000065222225
e8eee8eee86006ee94999499960060064444844444448444dddddddd444494440000000000000000000000000000000000000000000000000000000065666665
88888888886666884444444446006006eeeeeee8eeeeeee8ddddddddaaaaaaa90000000000000000000000000000000000000000000000000000000065566655
eee8eee8ee6006e89994999496006006e8888884e8888884dddddddda99999940000000000000000000000000000000000000000000000000000000065522255
88888888886006884444444446006006e8888884e8888884ddd6dddda99999940000000000000000000000000000000000000000000000000000000065222225
e8eee8eee86006ee94999499966666668444444484444444dddd2ddd944444440000000000000000000000000000000000000000000000000000000065222225
88888888886666884444444444444444eee8eeeeeee8eeeeddddddddaaa9aaaa0000000000000000000000000000000000000000000000000000000066666666
eee8eee8eee8eee899949994999499948884e8888884e888666666669994a9990000000000000000000000000000000000000000000000000000000062222222
888888888888888844444444444444448884e8888884e888dddddddd9994a9990000000000000000000000000000000000000000000000000000000065555555
e8eee8eee8eee8ee94999499949994994444844444448444dddddddd444494440000000000000000000000000000000000000000000000000000000066666666
888888888888888844444444444444446666666d6666666d55555552bbbbbbbb0000000000000000000000000000000094419441333333330000000000000000
eee8eee8eee8eee899949994999499946dddddd46dddddd452222221b32bbb3b0000000000000000000000000000000094419441322222230000000000000000
6666666666666666dddddddd666666666dddddd46dddddd452222221b333b3330000000000000000000000000000000099999999323333b30000000000000000
6222012662210026dddddddd62111116d4444444d44444442111111133b3333b0000000000000000000000000000000044444444323333b30000000000000000
6122012662100016dd2222dd61111016666d6666666d6666555255553b2333320000000000000000000000000000000011111111323333b30000000000000000
6010022666666666dd6002dd61011116ddd46dddddd46ddd2221522223333bb30000000000000000000000000000000094419441323333b30000000000000000
6100122662100226dd6002dd61111116ddd46dddddd46ddd2221522233b333230000000000000000000000000000000094419441323333b30000000000000000
6210222661000126dd6002dd622111064444d4444444d44411112111333233b30000000000000000000000000000000094419441323333b30000000000000000
6220122660000016dd6662dd621111166666666d6666666d5555555233b333330000000000000000000000000000000094419441323333b30000000000000000
6222022661000006dddddddd611011266dddddd46dddddd4522222213333b3330000000000000000000000000000000094419441323333b30000000000000000
6221012662100016dddddddd621112266dddddd46dddddd452222221b32333b20000000000000000000000000000000094419441323333b30000000000000000
6110102662200126dddddddd62212226d4444444d444444421111111232232220000000000000000000000000000000099999999323333b30000000000000000
6001201662101226dddddddd61111226666d6666666d6666555255556666666d0000000000000000000000000000000044444444323333b30000000000000000
6012210666666666dddddddd61011116ddd46dddddd46ddd222152226dddddd20000000000000000000000000000000011111111323333b30000000000000000
6122220688888888dddddddd61111016ddd46dddddd46ddd222152226dddddd200000000000000000000000000000000944194413bbbbbb30000000000000000
66666666e8eee8eedddddddd666666664444d4444444d44411112111d22222220000000000000000000000000000000094419441333333330000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000a9990000000000d6d00000000000000067000000000000000000000000000002dd000003bb000003bb000003bb00000000000000000ee7776d60006e60
000009a999400000000d666d0000dd6000000d67000000060006760000000676000022da00003bbb00003bbb00003bbb0000000000000000ee66661616061616
0000097666400000000d676d000d666d00000dcc000676d600d676d00000d676000029dd0000322200003222000032220000000000000000e88ddd6260006860
0000067666d0000000d6676d00d6676d00067fcc00d676dc00dcccd00000dccc00022dda00002267000022000000220000000000000000008800000000000000
0000077666d0000000d6676d0d66776d00d67f6700dcc6fc00fcccf00006fccc00029ddd00002dee0000200000002000000000000000000006c77c71d0001600
00006aa9999d000000d6676d06aaaa7d00dccd6700fcc6f600f676ff00d6f6760022d111000228ee00022167000221000000000000000000df66f6d221062210
00009aa9999400000d66676d6aaaaaa600fccd6700f676d600d676df00dcf676002211dd0002286700022667000221110000000000000000df77c7122d0122d0
00009777776400000d66676d6aa67aa600f67d670d676d660d6676df00fcd67600211dd60002d6670002d6ee00021167000000000000000022566f6d1000d100
00007666666600000d66776ddaaaaaa60d676d670d676d660d6676df00f6d6760011dd660022d6770022d8ee00221667000000000000000002666ddd20002200
0000767776660000d6dddd7d0daaaad80d67d6670d676d660d6676df0f6d6676001ddd66003bbbbb003bbbbb003bbbbb00000000000000002aa922229202aa20
00006676666d90006dddddee00dddd880d67dccc0d676ccc0d667ccc0d6d6ccc001dd77703bbbbbb03bbbbbb03bbbbbb0000000000000000999941111c019910
000966666d6d92006dd67eee006677880d6ccccc0d6ccccc0d6ccccc0d6ccccc000d7ddd03bbbbbb03bbbbbb03bbbbbb000000000000000044440002c0001100
0099d66ddd6d2200dddd6e6606ddddee0fccc6770fccc6770fccc6770fccc67700d6dd123b1111113b1111113b11111100000000000000000bb3003bb000bb00
00991dddddd12220dddd8e666ddddeeeffc66677ffc66677ffc66677ffc66677006dd12db1222222b1222222b12222220000000000000000bb66e6bb130b11b0
00922111111222200dd888dd6dd67e66fdd66777fdd66777fdd66777fdd66777006dd2123222222232222222322222220000000000000000bbdd8dbb13031130
002222222222222000d88888dddd6e66dd666777dd666777dd666777dd66677700ddd12d32222222322222223222222200000000000000003322223322022220
000000000000099000900000000000000c00f0000000000000999900000e00000000000000000000000000000000000000000000000000000000000000000000
0000090000000aa0000a9000000000c0007cc0f00009000009aaaa900009e000000ee00000000000000000000000000000000000000000000000000006666660
000009000000077000097aa70f0c000f00c7cf00009a90009aa77aa9009a900000e99e00000000000000000000000000000000000000000000000000066bb660
00009a90009a77770000a77a0fc000f0cfc777c009a7a9009a7777a90e97a9000e9aa9e000000000000000000000000000000000000000000000000006bbbb60
0009a7a9009a77770000a77a07fc0f700c777c7c009a90009a7777a909a77ae00e9aa9e000000000000000000000000000000000000000000000000006bbbb60
009a777a0000077000097aa7f77fc77f00cc7cf0000900009aa77aa90ea77a9000e99e00000000000000000000000000000000000000000000bbb606066bb660
99a7777700000aa0000a9000c77cc77c00f7c0000000000009aaaa90009aa9e0000ee00000000000000000000000000000000000000000006dbbbd2d06666660
009a777a00000990009000000cc00cc0000c0f00000000000099990000e99e0000000000000000000000000000000000000000000000000000333d0d0dddddd0
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000a9000000a9000000a90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000a91000000a100000a910000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000a1100000a1100000a110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000009a1100000a1100000a110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000aa9100000a1100009a110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000009aaa100009a910009aa910000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000009aaaaa00009aa9000aaaaa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000aaaaaa0009aaa9000aaaaa0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000aaa9aa0009aa9a000aa99a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000009aaa9a000aaa9a000aaa990000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000009aa22000a229a000aaaa20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000992220002229a0009aaa20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000922200022299000099920000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000aaaa00009a9a000099990000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000aaaa0000aaa90000aa9a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000009aaaa0000aaa90009aa9a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000aaaaa00099aa9000aaaa90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000aaaaa00099999000aaaa90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000009aaa9000999990009aaa90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000a99900002220000099990000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000222000002220000022200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000002222000000000000222200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
__label__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
07700000000000000000007700000000000000000000000000000777000000000000000007700000000000000000077000000000000000000000000000000000
07070077077007070000070007770770077707770777007700000070077700770707000007070777077700770000007000000000000000000000000000000000
07070707070707700000077700700707077007700070070000000070077007000707000007070770077707070000007000000000000000000000000000000000
07070777077007070000000700700770070007000070000700000070070007000777000007070700070707070000007000000000000000000000000000000000
07770707070707070000077000700707007700770070077000000070007700770707000007770077070707700000077700000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oo
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo8888
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooooo8888
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooo888ooo88oo
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88888ooooooo
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo888888ooooooo
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo888o888ooooo888oo
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88888o8ooooo88888oo
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo888oooooooo888888866
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88oo8ooooooo8oo888866666
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo8888oooooooo888oo666666666
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo8oo88ooooo8oo8888ooo666600066
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo888oooooo8888oo88ooooo660000066
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo888oooooo88888o6oooo888660000066
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88oo8ooooo8oo8888666ooo8888660000066
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo888ooooo8888oo666666688o888o660000066
0000000000000000000000000000000000000000000000000000000000000000000000000000000000ooooo88oo8ooooooo888ooo666606688o8ooo660000066
00000000000000000000000000000000000000000000000000000000000000000000000000000000oooooo888ooooo888ooooooo86000066ooooooo660000066
000000000000000000000000000000000000000000000000000000000000000000000000000000kooo888o8ooo88o888866ooo8886000066oooo8oo660066666
000000000000000000000000000000000000000000000000000000000000000000000000000kkkkoo8oooooo8888o8666668oo88o600006688888oo666666666
0000000000000000000000000000000000000000000000000000000000000000000000000kkkkko8ooooo88o88ooo6000668ooooo60000668888ooo666600066
0000000000000000000000000000000000000000000000000000000000000000000000kkkkkokokooooo8886oooo8600066oooooo600006688ooooo660000066
00000000000000000000000000000000000000000000000000000000000000000000kkkkkkokkkko88oo8666ooo88600066ooo8oo6000666oooo888660000066
0000000000000000000000000000000000000000000000000000000000000000000koooookkkkkk888oo66668oo8o6000668888oaaaaaaaaaoo8888660000066
0000000000000000000000000000000000000000000000000000000000000000000oookkkkkkook8oo8860068oooo600066888ooaaaaaaaaa8o888o660000066
0000000000000000000000000000000000000000000000000000000000000000000okkkkkookkkkoo8886006ooooo600066oooaaaa77777aaaa8ooo660000066
0000000000000000000000000000000000000000000000000000000000000000000kkookokkkkko8o8oo60068888o666666oooaaaa77777aaaaoooo660000066
00000000000000000000000000000000000000000000000000000000ggg00000000okokkkkkokoo8oooo60068888o6666668aaaa77aaaaaaaaappoo660000066
000000000000000000000000000000000000000000000000000000gggkkggggggg0okkkkkkokkkko88oo6006ooooo6000668aaaa77aaaaaaaaappoo660066666
000000000000000000000000000000000000000000000000000ggggkgkkkgkkkgkgkoooookkkkkk888oo6666ooo88600066oaa77aaaaaaaaaaappoo666666666
0000000000000000000000000000000000000000000000000ggkkk555g5555555gkoookkkkkkook8oooo66668oo88600066oaa77aaaaaaaaaaappoo6666o8888
000000000000000000000000000000000000000000000000gkk5g5555k5555555g5kkkkkkookookooo8860068oooo6000668aaaaaaaaaaaaaaapp8888ooo8888
00000000000000000000000000000000000000000000000gg550k0005g5005005k5kkookokkkkkkoo8886006ooooo6000668aaaaaaaaaaaaaaapp8888ooooooo
00000000000000000000000000000000000000000000ggll5550k0005k5005005g5okokkkkkokoo8oooo60068888o600066oaaaaaaaaaaaaaaapp8oooooooooo
000000000000000000000000000000000000000000g0l0005550g0005k5005005k5kkkkkkkookokooooo60068888o666666oaaaaaaaaaaaaaaappooooooooooo
000000000000000000000000000000000000000g0g0l0g005550k0005g5005005g5ooooookkkkkko88oo6006ooooo6oo8888aaaaaaaaaaaaaaappoooooo888oo
0000000000000000000000000000000000ggggg0llg000005550g0005k5005005k5okkkkkkkkook888oo6666oooo88oo8888ooaaaaaaaaaaappo8oo8888888oo
000000000000000000000000000000000ggkkllg00000g005550k0005g5005005k5kkkkkkookook8oooo66688oo888ooooooooaaaaaaaaaaapp88oo8888ooooo
000000000000000000000000000000000ggggll000g000005550g0005k5005005g5okookokkkkkkoo8888o888ooooooooooooo8oaaaaaaapp888oooooooooooo
000000000000000000000000000000g0gkkkkllg00000g005550k0005k5005005k5okkkkkkkokoo8o8888o8ooooooo888oo8888oaaaaaaappooooooooooo8888
00000000000000000000000000000ggg0ggkkll000g000005550g0005g5005005g5kkkkkkkookoo8oooooooo8888o8888oo888oodd666ddllooo88888ooo8888
00000000000000000000000000000g0g0ggggllg00000g005555k5555k5555555k5ooooookkkkkko88oo888o8888o8oooooooooodd666ddll8o888888ooo8888
00000000000000000000000000000gg00gkkkllg00g000005555k5gggggggggggg5kkkkkkkkkook888oo888ooooooooooooooodd6677766ddll888888oo66666
00000000000000000000000000000gg0gkgggll00000lgll555ggggkgkkkgkkkgkgkkkkkkookook8oooooooooooooooo8888oodd6677766ddll6666666666666
00000000000000000000000000000g0g0ggkkllgllgl0000gggkkkgkgkkkgkkkgkkokookokkkkkkoooooooo88oo888oo8888oodd6677766ddll66666666g0000
00000000000000000000000000000gg00ggggll00000gg0ggkkggggggggggggggggkkkkkkkkkkkkoo8888o888oo88866666666dd6677766ddll66llllggg0000
00000000000000000000000000000gg0gkkkkggg0gg00000gggkkkkgkkgkkkgkkkgooooookookoo8o6666666666666666666666ldd666ddlll666llllggg0000
000000000000000000ppp00000000g0g0ggkk0000000ggg0kgkggggggggggggggggooooookkkkkkoo6666660l666llgg000l666ldd666ddlll666llgg0000000
00000000000000000p7ppk0000000gg00gggg0ggg0gg0000gggkkkgkgkkkgkkkgkkkkkkkkkkkkkko86lllg00l666llgg000l666ldd666ddllg666llgg0000000
00000000000000000ppppk0000000ggggkkkk0000000gg0ggkk5555555555555555okookoookook886lllg00g666lg00000g666ldd666ddllg666llgg0066666
00000000000000000ppppk0000000g000ggggggg0gg0llll5555555555555555555okookokkkkkkoo6llg000g666lg00000g6666dd666ddll666666666666666
000000000000000000ppk000000000g00ggkklllllll0l005g00500055g0000055gkkkkkkkkkkkkoo66666666666666666666666dd666ddll666666666666666
00000000000000000057l00000000g00gkkkk00l00l00l005000500055000000550ooooookookoo8o6666666666666666666666ldd666ddlll666llgg00000ll
00000000000000000057l00000000000ggggg00l00l00l005000500055000000550ooooookkkkkkoo6llg00ll666lg000lll666ldd666ddlll666llgg00000ll
000000000000000000l5g00000000ggggggkk00l00l00l005000500055000000550kkkkkkkkkkkkoo6llg00ll666lg000lll666gdd666ddlll666gg0000000gg
000000000000000000l5g00000000000ggggg00l00l00l005g005g0055gg000055gokookoookook886gg000gl666g0000ggl666gdd666ddlll666gg0000000gg
000000000000000000l5g00000000000gkkkk00l00l00l005g005g0055gg000055gokookoookook886gg000gl666g0000ggl666gdd666ddlll666gg0000000gg
000000000000000000l5g00000000000gggkk00l00l00l005g00500055g0000055gkkkkkkkkkkkkoo6000000g6660000000g6660dd666ddllg66600000000000
000000000000000000l5g00000000000ggggg00l00l00l00500g50005500000g550ooooookookoo8o6gg00000666g00000006660dd666ddllg66600000000000
000000000000000000l5g00000000000gkkkk00l00l00l005g0g500g55g000gg55gkkkkkkkookoo8o6gg00000666g0000000666gdd666ddll0666gg000000000
000000000000000000l5g00000000g00ggggg00l00l00l005ggg5g0g55gg0ggg55gkkkkkkkkkkkkoo6llg000g666lg00000g666gdd666ddll0666gg000000000
000000000000000000l5g00000000g000gggg00l00l00l00500g500g550000gg550okookoookook8o6llg000g666lg00000g666ldd666ddllg666llgg0000000
ggggggggggggggggggl5gggggggggggggkkkk00l00l00l0050005000550000ppppppppppppppppp886lll00gl666ll000ggl666ldd666ddllg666llgg0000000
ggggggggggggggggggl5ggggggggggggggggglllllll0l0050005000550pppppppppppppppppppppppllg0ggl666ll000ggl666ldd666ddlll666llll0000000
gggggggggggggggggg57lgggggggggggggggggggggggllll55505000550pppppppppppppppppppppppllg0gll666lg00glll666ldd666ddlll666llll00000gg
llllllllllllllllll57lllllllllllllllllllllllllllllll55555555dddpppppppppppppppppddd66666ll666lg00glll666ldd666ddlll666llll00000gg
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllld666666ddddddddddoo6666666666666666666666ldd666ddlll666llgg000ggll
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllld666666dddddddddd8oooooooooooooo6666666666dd666ddll6666llgg000ggll
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllkkllookook888oo888ooooooooooooooo66dd666ddll66666666660ggll
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllkklllllllll88oo888o8888o8oooooooooodd666ddll666666666666666
555555555555555555555555555555555555555555555555555555555555555555555kkl555555555555555o8888o8888oo888oodd666ddlloooooooooo66666
555555555555555555555555555555555555555555555555555555555555555555555kkl5555555555555555555555888oo8888odd666ddllooooooooooooooo
555555555555555555555555555555555555555555555555555555555555555555555kkl5555555555555555555555555555558odd666ddll888oooooooooooo
555555555555555555555555555555555555555555555555555555555555555555555kkl55555555555555555555555555555555dd666ddll8888oo8888ooooo
555555555555555555555555555555555555555555555555555555555555555555555kkl55555555555555555555555555555555dd666ddll5558oo8888888oo
555555555555555555555555555555555555555555555555555555555555555555dddkklddd55555555555555555555555555555dd666ddll5555555555888oo
555555555555555555555555555555555555555555555555555555555555555556dddddddddd5555555555555555555555555555dd666ddll555555555555555
555555555555555555555555555555555555555555555555555555555555555556dddddddddd5555555555555555555555555555dd666ddll555555555555555
55555555555555555555555555555555555555555555555555555555555555555566666dddd55555555555555555555555555555dd666ddll555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd666ddll555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd666ddll555555555555555
55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd666ddll555555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555dd6677766ddll5555555555555
5555555555555555555555555555555555555555555555555555555555dd66dd55dd66dd555555555555555555555555555555dd6677766ddll5555555555555
5555555555555555555555555555555555555555555555555555555555dd66dd55dd66dd55555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555dd666666dd666666dd555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555dd666666dd666666dd555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555dd667766dd667766dd555555555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555555555dd667766dd667766dd555555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555dd66667766dd66776666dd5555555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666667766dd6677666666dd55555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666667766dd6677666666dd55555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666667766dd6677666666dd55555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666667766dd6677666666dd55555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666777766dd6677776666dd55555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555555dd6666777766dd6677776666dd55555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555dd66dddddddd77dd77dddddddd66dd555555555555555555555555555555555555555555555555
55555555555555555555555555555555555555555555555555dd66dddddddd77dd77dddddddd66dd555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555566dddddddddd888888dddddddddd66555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555566dddddddddd888888dddddddddd66555555555555555555555555555555555555555555555555
5555555555555555555555555555555555555555555555555566dddd667788888888887766dddd66555555555555555555555555555555555555555555555555
5555bbbb55bbbb555555555555bbbbbb55bbbbbb555555555566dddd667788888888887766dddd66555555aa55aa55aa55aa5555555555aaaa5555aaaaaa5555
5555bbbbbbbbbb055555555555bb000005bb00bb0555555555dddddddd66886666668866dddddddd555555aa05aa05aa05aa055555555550aa05555000aa0555
5555bbbbbbbbbb055555555555bbbbbb55bb05bb0555555555dddddddd66886666668866dddddddd555555aa05aa05aa05aa055555555555aa0555aaaaaa0555
555550bbbbbb000555555555555000bb05bb05bb0555555555ddddddddoo8866666688oodddddddd555555aa05aa05aa05aa055555555555aa0555aa00000555
55555550bb0005555555555555bbbbbb05bbbbbb0555555555ddddddddoo8866666688oodddddddd555555aa05aa05aa05aa0555555555aaaaaa55aaaaaa5555
5555555550055555555555555550000005500000055555555555ddddooooooddddddoooooodddd55555555500550055005500555555555500000055000000555
5555555555555555555555555555555555555555555555555555ddddooooooddddddoooooodddd55555555555555555555555555555555555555555555555555
555555555555555555555555555555555555555555555555555555ddoooooooooooooooooodd5555555555555555555555555555555555555555555555555555

__gff__
00000000000000000000000000040000000000000000000000000000000000000000020a0a0a000000000000000000000000080a000a0000000000000000000003024300433242430000000000000001010341002133422300000000000000010323436363634321000000000000000001010303212101230000000001010000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000
__map__
00404040404040404040404040404040404040405f5f5f404040404040404040320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0040232323232323400000004033333333333340000000402525252525352540320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0040230d23230d23400000004033263333263340000000402525252535252540320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0040232323232323400042624033333333333340000000612525253535252540320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f6161404002614063636300406161610261616100be00406161406102616161320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f202020000000000000000000000000000000000000000b00000b000000005f320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f00000c00000000000c00000000260c0000260000000000000000d200d2005f320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f0000000000ae00000000000000000000000000007d00007d7d00000000005f320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f00007d7d00000000cf0000af000000cf00ce00007d0000000000000000005f320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
5f60616140406140616051512600264242034242000020614040403232325050320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
00400000000000000000004060616142252535420000206000004032ce327000320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
000000000000000000000040000000422525354200bf20610000403232325000320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
00000000000000000000004040404042350d25425f5f5f6100004032ce327100320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
00000000000000000000007c0000000325352542003200610000403232327100320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
00000000000000000000007c0000004242424242003200614040403232325000320000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
00000000000000000000007c0000000000000000003200000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
6666666666666666666666666666666666666666464646666666666666666632000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000b0032000b0000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000b0032000b0000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000
3232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232
__sfx__
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00040000001300113003130041400514007140091400b1500f150111601416016170191701b1701e1701f1602016022150221502214021140201301e1301d1201c1201b1101a1161911019110181101711017110
000800002d35004350102501024010230102301023010230102301023010230102301023025620256202562000200002000020000200002000020000200002000020000200002000020000200002000020000200
0004000030650286502165019050170501505013050110500e0500c0500a05009050090400804007030070300702007020070200701007010080100a0100d010100301303015030190301c0301f0302203026630
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00020000034300a4400c45011450184501c450204501345011440114400f4400a4400744005440054300343003430034300342003420034200342003420034200341003410034100341003410034100341003410
00020000376303f6303a630306302b630376303f6303a6302e63029630226301f6301b6301863013630116300f6300c6300a63007630056200562003620036200362003620006100061000610006100061000610
0002000027150221501f1501d1501b150181501614013140111300f1300c1200a1200711005110001000010000100001000010000100001000010000100001000010000100001000010000100001000010000100
000200000064000640006400064000640006400064000640006400064000640006400064000640006400064000500005000050000500005000050000500005000050000500005000050000500005000050000000
00020000036500365005650076500a6400f64013640186401d6401f6401f6401f6301f6301f6301d6301d6301b6301b63018620186201662016620136201362011620116200f6100f6100c6100c6100a6100a610
000500000560003600166001330013700157000e7001370005600036001e30000000000003f600000003f600056000360005650036500560003600056500365000000000000000000000000003f650000003f600
000600000f330113501334013340113300f3300a3200a2200c2101321016210182101b2101b2101b2101821018210182101621016210162101321013210132101121011210112100f2100c2100a2100721003210
00040000333501f60037350246003c3502760027600296002760024600226001f6001b60018600166001660013600116000f6000f6000f6000c6000c6000c6000a6000a6000a6000760007600076000000000000
000400000324003240032400523005230052300723007220072200a2200a2200a2200c2200c2100f2100f210072000820008200092000b2000d20010200122001520016200002000020000200002000020000200
000400000f2300f2300c2300c2300a2300a2300a220072200722007220052200522005210032100321003210072000820008200092000b2000d20010200122001520016200002000020000200002000020000200
000800000a450024000a450004000345018400034001e40021400234002440023400234002340022400224001e4001e4001d4001d4001c4001c4001b4001b4001a4001a400194001940000400004000040000400
000800000a4500f45013450184501b450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00040000003700337005370073700a3600c3500f3401f3000f3000f30013300183000030003300033000330000300003000030000300003000030000300003000030000300003000030000300003000030000300
00020000072500525003250002000020000250052500525000200002000a2500f2500f25000200002000020000200002000020000200002000020000200002000020000200002000020000200002000020000200
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000001a25018250182501a2500f2500f2501025010250112500d25000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
__music__
00 504d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44
00 414d4d44

