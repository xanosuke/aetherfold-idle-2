/**
 * West Ronfaure bodies, in the same toon as the training rabbits:
 * rounded boxes, an ink shell, no cast shadows. One rig per family.
 * poseField drives patrol, the bite, and the named move.
 */
// @ts-nocheck
import { Bone, BoxGeometry, ConeGeometry, CylinderGeometry, Group, Mesh, MeshBasicMaterial, OctahedronGeometry, SphereGeometry, TorusGeometry } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type FieldLook =
  | "rabbit"
  | "jack"
  | "worm"
  | "bats"
  | "bat"
  | "funguar"
  | "amanita"
  | "crab"
  | "beetle"
  | "fungus-beetle"
  | "orc"
  | "goblin"
  | "skeleton"
  | "hound"
  | "sheep"
  | "bomb"
  | "lizard"
  | "pugil"
  | "warmachine"
  | "ghost"
  | "slime"
  | "sapling"
  | "scorpion"
  | "hecteyes"
  | "ahriman"
  | "weapon";

var INK = 1709072;
function bone(name, x = 0, y = 0, z = 0) {
	const b = new Bone();
	b.name = name;
	b.position.set(x, y, z);
	return b;
}
function shell(geo, color, toon, outline = true) {
	const mesh = new Mesh(geo, toon(color));
	mesh.castShadow = false;
	mesh.receiveShadow = true;
	if (outline) {
		const ink = new Mesh(geo, new MeshBasicMaterial({
			color: INK,
			side: 1
		}));
		ink.scale.setScalar(1.045);
		ink.castShadow = false;
		mesh.add(ink);
	}
	return mesh;
}
function box(w, h, d) {
	return new RoundedBoxGeometry(w, h, d, 2, .04);
}
function limb(parent, name, x, y, z, color, toon, short = false) {
	const upper = bone(name, x, y, z);
	parent.add(upper);
	const meat = shell(box(short ? .1 : .12, short ? .16 : .22, .12), color, toon);
	meat.position.y = short ? -.08 : -.1;
	upper.add(meat);
	return upper;
}
function face(head, toon, eye = 1709072, y = .02) {
	const eyeGeo = new BoxGeometry(.06, .07, .03);
	const l = shell(eyeGeo, eye, toon, false);
	l.position.set(.08, y, .16);
	const r = shell(eyeGeo, eye, toon, false);
	r.position.set(-.08, y, .16);
	head.add(l, r);
}
function humanoid(toon, skin, cloth, tall) {
	const root = new Group();
	const hips = bone("hips", 0, .42 * tall, 0);
	root.add(hips);
	const spine = bone("spine", 0, .28 * tall, 0);
	hips.add(spine);
	const torso = shell(box(.42 * tall, .4 * tall, .24 * tall), cloth, toon);
	spine.add(torso);
	const headB = bone("head", 0, .28 * tall, 0);
	spine.add(headB);
	const head = shell(box(.32 * tall, .3 * tall, .3 * tall), skin, toon);
	headB.add(head);
	face(headB, toon, INK, .04);
	limb(spine, "armL", .26 * tall, .08 * tall, 0, skin, toon);
	limb(spine, "armR", -.26 * tall, .08 * tall, 0, skin, toon);
	limb(hips, "legL", .12 * tall, -.02, 0, cloth, toon);
	limb(hips, "legR", -.12 * tall, -.02, 0, cloth, toon);
	return root;
}
function rabbit(toon, fur, jagged = false) {
	const root = new Group();
	const hips = bone("hips", 0, .28, 0);
	root.add(hips);
	const spine = bone("spine", 0, .1, .08);
	hips.add(spine);
	spine.add(shell(box(.42, .3, .62), fur, toon));
	const headB = bone("head", 0, .16, .28);
	spine.add(headB);
	headB.add(shell(box(.32, .26, .3), fur, toon));
	face(headB, toon, INK, .02);
	const earL = bone("earL", .08, .16, 0);
	const earR = bone("earR", -.08, .16, jagged ? -.04 : 0);
	headB.add(earL, earR);
	const left = shell(new BoxGeometry(.08, jagged ? .28 : .42, .05), fur, toon);
	left.position.y = .18;
	earL.add(left);
	const right = shell(new BoxGeometry(.08, jagged ? .5 : .42, .05), fur, toon);
	right.position.y = jagged ? .16 : .18;
	if (jagged) right.rotation.z = .7;
	earR.add(right);
	const nose = shell(new BoxGeometry(.06, .04, .04), 15769776, toon, false);
	nose.position.set(0, -.02, .16);
	headB.add(nose);
	limb(hips, "legL", .12, -.02, .16, fur, toon, true);
	limb(hips, "legR", -.12, -.02, .16, fur, toon, true);
	limb(spine, "armL", .16, .02, .2, fur, toon, true);
	limb(spine, "armR", -.16, .02, .2, fur, toon, true);
	const tail = shell(new SphereGeometry(.08, 6, 5), 16052198, toon, false);
	tail.position.set(0, .04, -.32);
	hips.add(tail);
	return root;
}
function worm(toon) {
	const root = new Group();
	const hips = bone("hips", 0, -.08, 0);
	root.add(hips);
	const colors = [
		9259608,
		12876682,
		9259608,
		13793928
	];
	for (let i = 0; i < 4; i++) {
		const seg = bone(i === 0 ? "spine" : `seg${i}`, 0, .08 + i * .18, 0);
		hips.add(seg);
		const mesh = shell(new SphereGeometry(.2 - i * .01, 8, 6), colors[i], toon);
		mesh.scale.set(1.05, .78, 1.05);
		seg.add(mesh);
	}
	const head = bone("head", 0, .86, 0);
	hips.add(head);
	const top = shell(new SphereGeometry(.22, 8, 6), 13793928, toon);
	top.scale.set(1.08, .82, 1.08);
	head.add(top);
	face(head, toon, 2757135, .02);
	const glob = shell(new SphereGeometry(.1, 6, 5), 13793928, toon, false);
	glob.name = "glob";
	glob.position.set(0, .2, .15);
	glob.scale.setScalar(.001);
	hips.add(glob);
	return root;
}
function bat(toon, scale, count, tint = "brown") {
	const pal = tint === "blood" ? {
		body: 6956072,
		head: 9056304,
		ear: 4855832,
		wing: 4856866,
		finger: 6957104,
		foot: 2756628,
		eye: 15917690,
		snout: 3806232
	} : tint === "dust" ? {
		body: 6051404,
		head: 7563354,
		ear: 4077616,
		wing: 5130302,
		finger: 6971990,
		foot: 2893858,
		eye: 16051412,
		snout: 3814444
	} : {
		body: 3811890,
		head: 4862008,
		ear: 2365472,
		wing: 2761252,
		finger: 3811376,
		foot: 1840152,
		eye: 14830127,
		snout: 2759714
	};
	const root = new Group();
	const hips = bone("hips", 0, 0, 0);
	root.add(hips);
	for (let i = 0; i < count; i++) {
		const ox = (i - (count - 1) / 2) * .78 * scale;
		const oy = (.78 + i % 2 * .14) * scale;
		const oz = (i === 1 ? .18 : i === 2 ? -.12 : 0) * scale;
		const body = bone(i === 0 ? "spine" : `seg${i}`, ox, oy, oz);
		hips.add(body);
		const torso = shell(new SphereGeometry(.26 * scale, 8, 6), pal.body, toon);
		torso.scale.set(.72, .5, 1.2);
		body.add(torso);
		const head = bone(i === 0 ? "head" : `head${i}`, 0, .02 * scale, .16 * scale);
		body.add(head);
		head.add(shell(new SphereGeometry(.09 * scale, 6, 5), pal.head, toon));
		const earGeo = new ConeGeometry(.03 * scale, .09 * scale, 4);
		const earL = shell(earGeo, pal.ear, toon);
		earL.position.set(.045 * scale, .08 * scale, 0);
		const earR = shell(earGeo, pal.ear, toon);
		earR.position.set(-.045 * scale, .08 * scale, 0);
		head.add(earL, earR);
		const snout = shell(new ConeGeometry(.035 * scale, .08 * scale, 4), pal.snout, toon);
		snout.rotation.x = Math.PI / 2;
		snout.position.set(0, -.01 * scale, .08 * scale);
		head.add(snout);
		const eyeGeo = new BoxGeometry(.035 * scale, .03 * scale, .02 * scale);
		const eyeL = shell(eyeGeo, pal.eye, toon, false);
		eyeL.position.set(.035 * scale, .015 * scale, .07 * scale);
		const eyeR = shell(eyeGeo, pal.eye, toon, false);
		eyeR.position.set(-.035 * scale, .015 * scale, .07 * scale);
		head.add(eyeL, eyeR);
		const wingL = bone(i === 0 ? "armL" : `wingL${i}`, .05 * scale, .02 * scale, 0);
		const wingR = bone(i === 0 ? "armR" : `wingR${i}`, -.05 * scale, .02 * scale, 0);
		body.add(wingL, wingR);
		const membrane = new BoxGeometry(.4 * scale, .04 * scale, .26 * scale);
		const finger = new BoxGeometry(.22 * scale, .025 * scale, .16 * scale);
		const l = shell(membrane, pal.wing, toon);
		l.position.set(.22 * scale, 0, .02 * scale);
		const l2 = shell(finger, pal.finger, toon);
		l2.position.set(.16 * scale, -.01 * scale, -.14 * scale);
		wingL.add(l, l2);
		const r = shell(membrane, pal.wing, toon);
		r.position.set(-.22 * scale, 0, .02 * scale);
		const r2 = shell(finger, pal.finger, toon);
		r2.position.set(-.16 * scale, -.01 * scale, -.14 * scale);
		wingR.add(r, r2);
		const footGeo = new BoxGeometry(.035 * scale, .07 * scale, .03 * scale);
		const footL = shell(footGeo, pal.foot, toon);
		footL.position.set(.04 * scale, -.1 * scale, .02 * scale);
		const footR = shell(footGeo, pal.foot, toon);
		footR.position.set(-.04 * scale, -.1 * scale, .02 * scale);
		body.add(footL, footR);
	}
	return root;
}
function funguar(toon, cap, spot) {
	const root = new Group();
	const hips = bone("hips", 0, .16, 0);
	root.add(hips);
	const stem = shell(new CylinderGeometry(.12, .16, .28, 7), 15984336, toon);
	stem.position.y = .16;
	hips.add(stem);
	const headB = bone("head", 0, .34, 0);
	hips.add(headB);
	const top = shell(new SphereGeometry(.28, 8, 6), cap, toon);
	top.scale.y = .55;
	headB.add(top);
	for (let i = 0; i < 4; i++) {
		const dot = shell(new SphereGeometry(.05, 5, 4), spot, toon, false);
		const a = i / 4 * Math.PI * 2;
		dot.position.set(Math.cos(a) * .12, .06, Math.sin(a) * .12);
		headB.add(dot);
	}
	limb(hips, "legL", .08, 0, .04, 15984336, toon, true);
	limb(hips, "legR", -.08, 0, .04, 15984336, toon, true);
	return root;
}
function crab(toon) {
	const root = new Group();
	const hips = bone("hips", 0, .22, 0);
	root.add(hips);
	const shellM = shell(new SphereGeometry(.28, 8, 6), 6978696, toon);
	shellM.scale.set(1.2, .55, 1);
	hips.add(shellM);
	const head = bone("head", 0, .12, .12);
	hips.add(head);
	const eyeL = shell(new SphereGeometry(.05, 5, 4), 16052198, toon, false);
	eyeL.position.set(.1, .12, .08);
	const eyeR = shell(new SphereGeometry(.05, 5, 4), 16052198, toon, false);
	eyeR.position.set(-.1, .12, .08);
	head.add(eyeL, eyeR);
	const clawL = bone("armL", .26, .02, .12);
	const clawR = bone("armR", -.26, .02, .12);
	hips.add(clawL, clawR);
	const claw = new BoxGeometry(.16, .1, .22);
	const l = shell(claw, 12876602, toon);
	clawL.add(l);
	const r = shell(claw, 12876602, toon);
	clawR.add(r);
	limb(hips, "legL", .16, -.08, -.08, 4872288, toon, true);
	limb(hips, "legR", -.16, -.08, -.08, 4872288, toon, true);
	return root;
}
function beetle(toon, shellColor, fungus = false) {
	const root = new Group();
	const hips = bone("hips", 0, .22, 0);
	root.add(hips);
	const body = shell(new SphereGeometry(.26, 8, 6), shellColor, toon);
	body.scale.set(.9, .62, 1.25);
	hips.add(body);
	const headB = bone("head", 0, .06, .28);
	hips.add(headB);
	headB.add(shell(new SphereGeometry(.12, 6, 5), 2761756, toon));
	const horn = shell(new ConeGeometry(.04, fungus ? .28 : .16, 5), fungus ? 6961752 : 1840658, toon);
	horn.rotation.x = Math.PI / 2;
	horn.position.set(0, .04, .14);
	headB.add(horn);
	face(headB, toon, 16052198, 0);
	limb(hips, "legL", .18, -.06, .08, 2761756, toon, true);
	limb(hips, "legR", -.18, -.06, .08, 2761756, toon, true);
	limb(hips, "armL", .16, -.02, .2, 2761756, toon, true);
	limb(hips, "armR", -.16, -.02, .2, 2761756, toon, true);
	return root;
}
function hound(toon, grim = false) {
	const root = new Group();
	const hips = bone("hips", 0, .32, 0);
	root.add(hips);
	const spine = bone("spine", 0, .08, .1);
	hips.add(spine);
	const fur = grim ? 2761768 : 2761768;
	const dark = grim ? 1314836 : 3813424;
	const ear = grim ? 6959160 : 1840658;
	spine.add(shell(box(.28, .26, .62), fur, toon));
	const headB = bone("head", 0, .1, .36);
	spine.add(headB);
	headB.add(shell(box(.22, .2, .28), dark, toon));
	face(headB, toon, grim ? 12863546 : 14826287, .02);
	const earL = bone("earL", .1, .12, 0);
	const earR = bone("earR", -.1, .12, 0);
	headB.add(earL, earR);
	earL.add(shell(new BoxGeometry(.06, .14, .04), ear, toon));
	earR.add(shell(new BoxGeometry(.06, .14, .04), ear, toon));
	limb(hips, "legL", .1, -.02, .16, fur, toon, true);
	limb(hips, "legR", -.1, -.02, .16, fur, toon, true);
	limb(spine, "armL", .1, 0, -.18, fur, toon, true);
	limb(spine, "armR", -.1, 0, -.18, fur, toon, true);
	const tail = bone("tail", 0, .08, -.32);
	hips.add(tail);
	tail.add(shell(new BoxGeometry(.06, .06, .22), ear, toon));
	return root;
}
function sheep(toon, ram = false) {
	const root = new Group();
	const hips = bone("hips", 0, .28, 0);
	root.add(hips);
	const wool = shell(new SphereGeometry(.32, 8, 6), ram ? 15195336 : 16052198, toon);
	wool.scale.set(ram ? 1.08 : 1, ram ? .78 : .85, ram ? 1.22 : 1.15);
	hips.add(wool);
	const headB = bone("head", 0, .08, .32);
	hips.add(headB);
	headB.add(shell(box(.2, .22, .26), ram ? 12035212 : 12892324, toon));
	face(headB, toon, INK, .02);
	if (ram) {
		const hornL = shell(new ConeGeometry(.05, .22, 5), 12886106, toon, false);
		const hornR = shell(new ConeGeometry(.05, .22, 5), 12886106, toon, false);
		hornL.position.set(.09, .12, .02);
		hornR.position.set(-.09, .12, .02);
		hornL.rotation.z = -.85;
		hornR.rotation.z = .85;
		hornL.rotation.x = -.45;
		hornR.rotation.x = -.45;
		headB.add(hornL, hornR);
	}
	limb(hips, "legL", .14, -.16, .1, 12892324, toon, true);
	limb(hips, "legR", -.14, -.16, .1, 12892324, toon, true);
	limb(hips, "armL", .14, -.16, -.12, 12892324, toon, true);
	limb(hips, "armR", -.14, -.16, -.12, 12892324, toon, true);
	return root;
}
function bomb(toon) {
	const root = new Group();
	const hips = bone("hips", 0, .46, 0);
	root.add(hips);
	const body = shell(new SphereGeometry(.34, 10, 8), 14711346, toon);
	hips.add(body);
	const head = bone("head", 0, .08, .22);
	hips.add(head);
	face(head, toon, 1709072, 0);
	const mouth = shell(new BoxGeometry(.12, .04, .03), 1709072, toon, false);
	mouth.position.set(0, -.08, .28);
	hips.add(mouth);
	const fuse = bone("spine", 0, .32, 0);
	hips.add(fuse);
	const wick = shell(new CylinderGeometry(.03, .03, .16, 5), 15984336, toon);
	wick.position.y = .08;
	fuse.add(wick);
	const spark = shell(new OctahedronGeometry(.05, 0), 16048762, toon, false);
	spark.name = "spark";
	spark.position.y = .18;
	fuse.add(spark);
	limb(hips, "armL", .28, 0, .04, 12868136, toon, true);
	limb(hips, "armR", -.28, 0, .04, 12868136, toon, true);
	return root;
}
function lizard(toon) {
	const root = new Group();
	const hips = bone("hips", 0, .22, 0);
	root.add(hips);
	const spine = bone("spine", 0, .08, .02);
	hips.add(spine);
	const body = shell(box(.34, .22, .72), 5138996, toon);
	spine.add(body);
	const belly = shell(box(.22, .08, .46), 13350026, toon, false);
	belly.position.set(0, -.1, .04);
	spine.add(belly);
	const headB = bone("head", 0, .1, .4);
	spine.add(headB);
	headB.add(shell(box(.22, .16, .28), 6060604, toon));
	face(headB, toon, 12886106, .02);
	const jaw = shell(box(.16, .05, .14), 4020780, toon, false);
	jaw.position.set(0, -.06, .12);
	headB.add(jaw);
	limb(hips, "legL", .16, -.02, .18, 5138996, toon, true);
	limb(hips, "legR", -.16, -.02, .18, 5138996, toon, true);
	limb(spine, "armL", .16, .02, .28, 5138996, toon, true);
	limb(spine, "armR", -.16, .02, .28, 5138996, toon, true);
	const tail = bone("tail", 0, .06, -.4);
	hips.add(tail);
	const whip = shell(box(.1, .08, .46), 4020780, toon);
	whip.position.set(0, 0, -.2);
	tail.add(whip);
	return root;
}
function pugil(toon) {
	const root = new Group();
	const hips = bone("hips", 0, .28, 0);
	root.add(hips);
	const spine = bone("spine", 0, .06, 0);
	hips.add(spine);
	const body = shell(new SphereGeometry(.28, 8, 6), 3829386, toon);
	body.scale.set(1.15, .82, 1.35);
	spine.add(body);
	const belly = shell(new SphereGeometry(.16, 6, 5), 14017224, toon, false);
	belly.position.set(0, -.08, .04);
	spine.add(belly);
	const headB = bone("head", 0, .02, .28);
	spine.add(headB);
	headB.add(shell(new SphereGeometry(.16, 7, 6), 4884132, toon));
	face(headB, toon, 16052198, .04);
	const lip = shell(box(.18, .05, .08), 2771554, toon, false);
	lip.position.set(0, -.06, .12);
	headB.add(lip);
	limb(spine, "armL", .22, 0, .02, 3104376, toon, true);
	limb(spine, "armR", -.22, 0, .02, 3104376, toon, true);
	const tail = bone("tail", 0, .02, -.28);
	hips.add(tail);
	const fin = shell(box(.04, .16, .18), 3104376, toon, false);
	fin.position.z = -.06;
	tail.add(fin);
	return root;
}
function warmachine(toon, flame) {
	const root = new Group();
	const hips = bone("hips", 0, .28, 0);
	root.add(hips);
	const bed = shell(box(.72, .16, .9), flame ? 5911076 : 6965810, toon);
	hips.add(bed);
	const spine = bone("spine", 0, .16, -.06);
	hips.add(spine);
	spine.add(shell(box(.48, .28, .48), flame ? 4860444 : 5913128, toon));
	const headB = bone("head", 0, .16, .22);
	spine.add(headB);
	const barrel = shell(new CylinderGeometry(.08, .1, .46, 6), flame ? 3811874 : 4866104, toon);
	barrel.rotation.x = Math.PI / 2;
	barrel.position.z = .16;
	headB.add(barrel);
	const mouth = shell(new CylinderGeometry(.11, .11, .06, 6), flame ? 6956052 : 2761760, toon, false);
	mouth.rotation.x = Math.PI / 2;
	mouth.position.z = .4;
	headB.add(mouth);
	if (flame) {
		const tongue = shell(new ConeGeometry(.07, .22, 5), 16738858, toon, false);
		tongue.name = "flame";
		tongue.rotation.x = Math.PI / 2;
		tongue.position.z = .52;
		headB.add(tongue);
	}
	const wheelGeo = new CylinderGeometry(.16, .16, .08, 7);
	for (const [name, x] of [["wheelL", .4], ["wheelR", -.4]]) {
		const hub = bone(name, x, -.08, 0);
		hips.add(hub);
		const wheel = shell(wheelGeo, 3813416, toon);
		wheel.rotation.z = Math.PI / 2;
		hub.add(wheel);
	}
	return root;
}
function weapon(hand, toon, kind) {
	if (!hand) return;
	if (kind === "axe") {
		const axe = shell(box(.06, .46, .06), 6965810, toon);
		axe.position.set(0, -.2, .04);
		const blade = shell(box(.18, .16, .04), 9081756, toon);
		blade.position.set(.08, .16, 0);
		axe.add(blade);
		hand.add(axe);
	} else if (kind === "staff") {
		const staff = shell(new CylinderGeometry(.035, .04, .7, 5), 6965810, toon);
		staff.position.set(0, -.05, .04);
		const gem = shell(new OctahedronGeometry(.07, 0), 6982911, toon, false);
		gem.position.y = .36;
		staff.add(gem);
		hand.add(staff);
	} else if (kind === "dagger") {
		const blade = shell(box(.04, .28, .02), 12963286, toon);
		blade.position.set(0, -.12, .06);
		hand.add(blade);
	} else if (kind === "pick") {
		const haft = shell(new CylinderGeometry(.03, .03, .46, 5), 6965810, toon);
		haft.position.set(0, -.1, .04);
		const bit = shell(box(.22, .06, .06), 9081756, toon);
		bit.position.y = .2;
		haft.add(bit);
		hand.add(haft);
	} else if (kind === "rod") {
		const rod = shell(new CylinderGeometry(.025, .03, .72, 5), 9071162, toon);
		rod.position.set(.04, -.02, .08);
		rod.rotation.x = .9;
		hand.add(rod);
	} else if (kind === "sword") {
		const blade = shell(box(.05, .4, .02), 14015458, toon);
		blade.position.set(0, -.16, .04);
		hand.add(blade);
	} else if (kind === "scythe") {
		const haft = shell(new CylinderGeometry(.03, .03, .62, 5), 4864562, toon);
		haft.position.set(0, -.05, .02);
		const bit = shell(new BoxGeometry(.16, .08, .04), 12963286, toon);
		bit.position.set(.08, .28, 0);
		bit.rotation.z = -.6;
		haft.add(bit);
		hand.add(haft);
	} else if (kind === "polearm") {
		const haft = shell(new CylinderGeometry(.028, .032, .92, 5), 6965810, toon);
		haft.position.set(.02, .08, .02);
		const tip = shell(new ConeGeometry(.06, .18, 5), 12963286, toon, false);
		tip.position.y = .52;
		haft.add(tip);
		hand.add(haft);
	} else if (kind === "bow") {
		const stave = shell(box(.05, .62, .04), 9067058, toon);
		stave.position.set(0, .02, .06);
		const string = shell(box(.012, .5, .012), 15261904, toon, false);
		string.position.z = .04;
		stave.add(string);
		hand.add(stave);
	} else if (kind === "club") {
		const haft = shell(new CylinderGeometry(.045, .055, .5, 5), 6965810, toon);
		haft.position.set(0, -.12, .04);
		const knob = shell(new SphereGeometry(.09, 6, 5), 9069112, toon);
		knob.position.y = .24;
		haft.add(knob);
		hand.add(haft);
	} else if (kind === "shield") {
		const board = shell(box(.28, .36, .06), 6961706, toon);
		board.position.set(0, -.02, .1);
		const boss = shell(new SphereGeometry(.05, 5, 4), 12886106, toon, false);
		boss.position.z = .05;
		board.add(boss);
		hand.add(board);
	} else if (kind === "needle") {
		const needle = shell(box(.02, .22, .02), 15261904, toon, false);
		needle.position.set(0, -.06, .05);
		needle.rotation.z = .5;
		hand.add(needle);
	}
}
/** Hood, hook nose, and a pot belly. The ears stay under the cowl. */
function goblin(toon) {
	const root = new Group();
	const skin = 10727770;
	const hoodC = 3107636;
	const hoodD = 2182184;
	const leather = 9067058;
	const hips = bone("hips", 0, .24, 0);
	root.add(hips);
	const spine = bone("spine", 0, .14, .02);
	spine.userData.hunch = .32;
	spine.rotation.x = .32;
	hips.add(spine);
	const belly = shell(new SphereGeometry(.145, 8, 6), leather, toon);
	belly.scale.set(1.32, 1.02, 1.16);
	belly.position.set(0, -.01, .03);
	spine.add(belly);
	const vest = shell(box(.24, .11, .07), 12880202, toon, false);
	vest.position.set(0, .05, .14);
	spine.add(vest);
	const belt = shell(box(.3, .042, .26), 2366486, toon, false);
	belt.position.set(0, -.09, .03);
	spine.add(belt);
	const buckle = shell(box(.07, .05, .035), 12886106, toon, false);
	buckle.position.set(0, -.09, .16);
	spine.add(buckle);
	const armL = limb(spine, "armL", .19, .07, .05, skin, toon, true);
	const armR = limb(spine, "armR", -.19, .07, .05, skin, toon, true);
	for (const arm of [armL, armR]) {
		const mitt = shell(box(.12, .08, .11), 6965808, toon);
		mitt.position.set(0, -.15, .03);
		arm.add(mitt);
	}
	const legL = limb(hips, "legL", .08, -.01, .01, 6045744, toon, true);
	const legR = limb(hips, "legR", -.08, -.01, .01, 6045744, toon, true);
	for (const leg of [legL, legR]) {
		const boot = shell(box(.13, .09, .18), 2366486, toon);
		boot.position.set(0, -.15, .05);
		leg.add(boot);
	}
	const headB = bone("head", 0, .2, .02);
	spine.add(headB);
	const cavity = shell(box(.16, .12, .1), 1185295, toon, false);
	cavity.position.set(0, -.01, .05);
	headB.add(cavity);
	const hood = shell(new ConeGeometry(.17, .38, 6), hoodC, toon);
	hood.position.set(0, .1, -.01);
	hood.rotation.x = .4;
	headB.add(hood);
	const drapeL = shell(box(.06, .15, .11), hoodD, toon);
	drapeL.position.set(.1, -.02, .04);
	const drapeR = shell(box(.06, .15, .11), hoodD, toon);
	drapeR.position.set(-.1, -.02, .04);
	const cowl = shell(box(.16, .12, .07), hoodD, toon);
	cowl.position.set(0, .01, -.08);
	headB.add(drapeL, drapeR, cowl);
	const nose = shell(new ConeGeometry(.046, .16, 5), skin, toon, false);
	nose.rotation.x = Math.PI / 2 + .85;
	nose.position.set(0, -.015, .11);
	headB.add(nose);
	const eyeGeo = new BoxGeometry(.034, .026, .02);
	const eyeL = shell(eyeGeo, 15917930, toon, false);
	eyeL.position.set(.045, .02, .1);
	const eyeR = shell(eyeGeo, 15917930, toon, false);
	eyeR.position.set(-.045, .02, .1);
	headB.add(eyeL, eyeR);
	return root;
}
/** Broad soldier. Bronze, scale, cloth, or lizard, with the tusks left bare. */
function orc(toon, kit) {
	const root = new Group();
	const skin = 7049018;
	const bronze = 12886106;
	const bronzeDark = 9069104;
	const scaleMetal = 8226446;
	const scaleDark = 5397090;
	const cloth = 3945552;
	const lizard = 7166520;
	const metal = kit === "scale" ? scaleMetal : kit === "lizard" ? lizard : bronze;
	const metalDark = kit === "scale" ? scaleDark : kit === "lizard" ? 4865064 : bronzeDark;
	const hips = bone("hips", 0, .38, 0);
	root.add(hips);
	const spine = bone("spine", 0, .22, 0);
	hips.add(spine);
	const torsoColor = kit === "bronze" ? skin : kit === "cloth" ? cloth : metal;
	const chest = shell(box(.5, .42, .28), torsoColor, toon);
	chest.position.y = .02;
	spine.add(chest);
	if (kit === "bronze") {
		const belt = shell(box(.46, .06, .3), bronzeDark, toon, false);
		belt.position.set(0, -.14, .02);
		spine.add(belt);
	}
	if (kit !== "cloth") {
		const padL = shell(box(.16, .08, .18), metal, toon);
		padL.position.set(.3, .16, 0);
		const padR = shell(box(.16, .08, .18), metal, toon);
		padR.position.set(-.3, .16, 0);
		spine.add(padL, padR);
	}
	const armColor = kit === "bronze" ? skin : kit === "cloth" ? cloth : metalDark;
	const armL = limb(spine, "armL", .32, .14, 0, armColor, toon);
	const armR = limb(spine, "armR", -.32, .14, 0, armColor, toon);
	for (const arm of [armL, armR]) {
		const mitt = shell(box(.14, .08, .12), kit === "cloth" ? 2761784 : metal, toon);
		mitt.position.set(0, -.2, .02);
		arm.add(mitt);
	}
	const legColor = kit === "bronze" ? bronzeDark : kit === "cloth" ? 2761784 : metalDark;
	const legL = limb(hips, "legL", .13, -.02, 0, legColor, toon);
	const legR = limb(hips, "legR", -.13, -.02, 0, legColor, toon);
	for (const leg of [legL, legR]) {
		const boot = shell(box(.15, .09, .18), kit === "cloth" ? 2366488 : metal, toon);
		boot.position.set(0, -.2, .03);
		leg.add(boot);
	}
	if (kit === "cloth") {
		const robe = shell(box(.48, .36, .3), cloth, toon);
		robe.position.set(0, -.04, .01);
		hips.add(robe);
	} else {
		const skirt = shell(box(.44, .18, .28), metal, toon);
		skirt.position.set(0, .02, .01);
		hips.add(skirt);
	}
	const headB = bone("head", 0, .28, .02);
	spine.add(headB);
	headB.add(shell(box(.3, .24, .26), skin, toon));
	const jaw = shell(box(.22, .07, .12), skin, toon, false);
	jaw.position.set(0, -.1, .08);
	headB.add(jaw);
	const brow = shell(box(.32, .05, .08), 2768920, toon, false);
	brow.position.set(0, .06, .12);
	headB.add(brow);
	face(headB, toon, 1709068, -.01);
	const tuskL = shell(new ConeGeometry(.05, .3, 5), 15985364, toon, false);
	const tuskR = shell(new ConeGeometry(.05, .3, 5), 15985364, toon, false);
	tuskL.position.set(.07, -.02, .1);
	tuskR.position.set(-.07, -.02, .1);
	tuskL.rotation.set(.7, 0, -.6);
	tuskR.rotation.set(.7, 0, .6);
	headB.add(tuskL, tuskR);
	if (kit === "cloth") {
		const circlet = shell(new TorusGeometry(.17, .028, 6, 12), bronze, toon, false);
		circlet.rotation.x = Math.PI / 2;
		circlet.position.y = .13;
		headB.add(circlet);
	} else if (kit === "scale") {
		const helm = shell(new SphereGeometry(.2, 7, 5), scaleMetal, toon);
		helm.scale.set(1.08, .62, 1.08);
		helm.position.set(0, .12, -.02);
		headB.add(helm);
		const guard = shell(box(.26, .055, .05), scaleDark, toon, false);
		guard.position.set(0, -.02, .15);
		headB.add(guard);
	} else if (kit === "lizard") {
		const helm = shell(box(.34, .14, .32), lizard, toon);
		helm.position.set(0, .14, -.02);
		headB.add(helm);
		const crest = shell(box(.05, .26, .14), 9058866, toon, false);
		crest.position.set(0, .32, -.02);
		headB.add(crest);
	} else {
		const cap = shell(new SphereGeometry(.19, 7, 5), bronze, toon);
		cap.scale.set(1.05, .62, 1.08);
		cap.position.set(0, .13, -.02);
		headB.add(cap);
		const brim = shell(box(.34, .04, .1), bronzeDark, toon, false);
		brim.position.set(0, .07, .08);
		headB.add(brim);
	}
	return root;
}
/** A sheet with no feet. The eyes are the only solid part of the face. */
function ghost(toon) {
	const root = new Group();
	const cloth = 14012614;
	const hem = 9341572;
	const hips = bone("hips", 0, .72, 0);
	root.add(hips);
	const spine = bone("spine", 0, .22, 0);
	hips.add(spine);
	const sheet = shell(new ConeGeometry(.34, .72, 7), cloth, toon);
	sheet.position.y = -.08;
	spine.add(sheet);
	const tatter = shell(box(.22, .16, .08), hem, toon, false);
	tatter.position.set(.08, -.42, .06);
	tatter.rotation.z = .4;
	spine.add(tatter);
	const armL = bone("armL", .16, .02, .04);
	const armR = bone("armR", -.16, .02, .04);
	spine.add(armL, armR);
	const sleeve = new BoxGeometry(.08, .28, .08);
	const l = shell(sleeve, cloth, toon);
	l.position.set(.06, -.12, 0);
	l.rotation.z = .5;
	armL.add(l);
	const r = shell(sleeve, cloth, toon);
	r.position.set(-.06, -.12, 0);
	r.rotation.z = -.5;
	armR.add(r);
	const headB = bone("head", 0, .16, .02);
	spine.add(headB);
	const cowl = shell(new SphereGeometry(.16, 7, 6), cloth, toon);
	cowl.scale.set(1, .85, .9);
	headB.add(cowl);
	const eyeGeo = new BoxGeometry(.05, .045, .03);
	const eyeL = shell(eyeGeo, 15917690, toon, false);
	eyeL.position.set(.06, .02, .12);
	const eyeR = shell(eyeGeo, 15917690, toon, false);
	eyeR.position.set(-.06, .02, .12);
	headB.add(eyeL, eyeR);
	const wisp = bone("seg1", 0, -.36, -.02);
	hips.add(wisp);
	const tail = shell(new SphereGeometry(.08, 5, 4), hem, toon, false);
	tail.scale.set(1, 1.4, .7);
	wisp.add(tail);
	return root;
}
/** A puddle that learned to stand. Pseudopods do the walking. */
function slime(toon, kind = "") {
	const root = new Group();
	const goo = kind === "oil" ? 1842712 : kind === "mass" ? 6965894 : 7323491;
	const deep = kind === "oil" ? 921614 : kind === "mass" ? 3811416 : 4028997;
	const eye = kind === "oil" ? 14149576 : 1709072;
	const hips = bone("hips", 0, .28, 0);
	root.add(hips);
	const body = shell(new SphereGeometry(.34, 8, 6), goo, toon);
	body.scale.set(1.15, .78, 1.05);
	hips.add(body);
	const belly = shell(new SphereGeometry(.16, 6, 5), deep, toon, false);
	belly.position.set(0, -.02, .12);
	hips.add(belly);
	const spine = bone("spine", 0, .16, 0);
	hips.add(spine);
	const headB = bone("head", 0, .18, .02);
	spine.add(headB);
	const cap = shell(new SphereGeometry(.14, 6, 5), goo, toon);
	cap.scale.y = .7;
	headB.add(cap);
	const eyeGeo = new BoxGeometry(.045, .05, .03);
	const eyeL = shell(eyeGeo, eye, toon, false);
	eyeL.position.set(.05, .02, .1);
	const eyeR = shell(eyeGeo, eye, toon, false);
	eyeR.position.set(-.05, .02, .1);
	headB.add(eyeL, eyeR);
	limb(hips, "armL", .28, .02, .06, deep, toon, true);
	limb(hips, "armR", -.28, .02, .06, deep, toon, true);
	limb(hips, "legL", .12, -.16, .04, deep, toon, true);
	limb(hips, "legR", -.12, -.16, .04, deep, toon, true);
	const glob = shell(new SphereGeometry(.11, 6, 5), goo, toon, false);
	glob.name = "glob";
	glob.position.set(0, .08, .2);
	glob.scale.setScalar(.001);
	hips.add(glob);
	return root;
}
/** Cherry wood. Roots for feet, a canopy for a head. Ancient is the cemetery tree. */
function sapling(toon, ancient) {
	const root = new Group();
	const bark = ancient ? 4863016 : 7030322;
	const leaf = ancient ? 3107384 : 4034373;
	const bloom = ancient ? 15909328 : 16037832;
	const hips = bone("hips", 0, .16, 0);
	root.add(hips);
	const spine = bone("spine", 0, .18, 0);
	hips.add(spine);
	const trunk = shell(new CylinderGeometry(ancient ? .16 : .1, ancient ? .2 : .13, ancient ? .7 : .48, 6), bark, toon);
	trunk.position.y = .2;
	spine.add(trunk);
	const armL = bone("armL", .12, .34, 0);
	const armR = bone("armR", -.12, .34, 0);
	spine.add(armL, armR);
	const branch = new CylinderGeometry(.035, .045, .42, 5);
	const l = shell(branch, bark, toon);
	l.rotation.z = .9;
	l.position.set(.12, .08, 0);
	armL.add(l);
	const r = shell(branch, bark, toon);
	r.rotation.z = -.9;
	r.position.set(-.12, .08, 0);
	armR.add(r);
	const headB = bone("head", 0, ancient ? .62 : .5, 0);
	spine.add(headB);
	const canopy = shell(new SphereGeometry(ancient ? .42 : .28, 8, 6), leaf, toon);
	canopy.scale.y = .72;
	headB.add(canopy);
	for (let i = 0; i < (ancient ? 6 : 4); i++) {
		const petal = shell(new SphereGeometry(.045, 4, 3), bloom, toon, false);
		const a = i / (ancient ? 6 : 4) * Math.PI * 2;
		petal.position.set(Math.cos(a) * .16, .06, Math.sin(a) * .16);
		headB.add(petal);
	}
	const faceEyes = new BoxGeometry(.04, .035, .03);
	const eyeL = shell(faceEyes, 15917690, toon, false);
	eyeL.position.set(.06, -.02, .2);
	const eyeR = shell(faceEyes, 15917690, toon, false);
	eyeR.position.set(-.06, -.02, .2);
	headB.add(eyeL, eyeR);
	limb(hips, "legL", .1, -.02, .02, bark, toon, true);
	limb(hips, "legR", -.1, -.02, .02, bark, toon, true);
	return root;
}
/** Low body, two cutlass claws, a tail that aims over the back. */
function scorpion(toon) {
	const root = new Group();
	const plate = 9069112;
	const dark = 3811868;
	const hips = bone("hips", 0, .22, 0);
	root.add(hips);
	const body = shell(new SphereGeometry(.22, 7, 6), plate, toon);
	body.scale.set(.85, .55, 1.35);
	hips.add(body);
	const spine = bone("spine", 0, .06, .02);
	hips.add(spine);
	const headB = bone("head", 0, .04, .28);
	spine.add(headB);
	headB.add(shell(box(.16, .1, .14), dark, toon));
	face(headB, toon, 15917690, 0);
	const clawGeo = new BoxGeometry(.16, .08, .22);
	const armL = bone("armL", .2, .04, .2);
	const armR = bone("armR", -.2, .04, .2);
	hips.add(armL, armR);
	const l = shell(clawGeo, 12886106, toon);
	l.rotation.y = -.4;
	armL.add(l);
	const r = shell(clawGeo, 12886106, toon);
	r.rotation.y = .4;
	armR.add(r);
	limb(hips, "legL", .18, -.06, .05, dark, toon, true);
	limb(hips, "legR", -.18, -.06, .05, dark, toon, true);
	const seg1 = bone("seg1", .16, -.04, -.08);
	const seg2 = bone("seg2", -.16, -.04, -.08);
	hips.add(seg1, seg2);
	seg1.add(shell(box(.06, .05, .16), dark, toon));
	seg2.add(shell(box(.06, .05, .16), dark, toon));
	const tail = bone("tail", 0, .08, -.22);
	hips.add(tail);
	const seg = shell(new CylinderGeometry(.045, .06, .34, 5), plate, toon);
	seg.position.y = .14;
	tail.add(seg);
	const stinger = shell(new ConeGeometry(.05, .16, 5), 9255474, toon, false);
	stinger.position.y = .32;
	tail.add(stinger);
	return root;
}
/** A floating knot of eyes. Tentacles keep it off the flagstones. */
function hecteyes(toon) {
	const root = new Group();
	const flesh = 12872314;
	const hips = bone("hips", 0, .7, 0);
	root.add(hips);
	const spine = bone("spine", 0, .05, 0);
	hips.add(spine);
	const ball = shell(new SphereGeometry(.32, 8, 7), flesh, toon);
	spine.add(ball);
	const headB = bone("head", 0, .02, .02);
	spine.add(headB);
	for (let i = 0; i < 7; i++) {
		const eye = shell(new SphereGeometry(.055, 5, 4), 16052452, toon, false);
		const pupil = shell(new SphereGeometry(.025, 4, 3), 1709072, toon, false);
		const a = i / 7 * Math.PI * 2;
		const y = i % 2 === 0 ? .08 : -.06;
		eye.position.set(Math.cos(a) * .26, y, Math.sin(a) * .26);
		pupil.position.set(0, 0, .04);
		eye.add(pupil);
		headB.add(eye);
	}
	limb(spine, "armL", .18, -.12, .08, 9255498, toon, true);
	limb(spine, "armR", -.18, -.12, .08, 9255498, toon, true);
	limb(hips, "legL", .1, -.22, .04, 9255498, toon, true);
	limb(hips, "legR", -.1, -.22, .04, 9255498, toon, true);
	return root;
}
/** One huge eye, bat wings, a little mouth. The Ahriman family floats. */
function ahriman(toon, variant) {
	const root = new Group();
	const gloom = variant === "gloom";
	const batEye = variant === "bat";
	const sclera = gloom ? 2761776 : batEye ? 15194018 : 15986660;
	const iris = gloom ? 6957780 : batEye ? 12876602 : 9251378;
	const leather = gloom ? 2365472 : batEye ? 3810328 : 4862024;
	const membrane = gloom ? 3811416 : 2760752;
	const hips = bone("hips", 0, .82, 0);
	root.add(hips);
	const spine = bone("spine", 0, .08, 0);
	hips.add(spine);
	const ball = shell(new SphereGeometry(.34, 10, 8), sclera, toon);
	ball.scale.set(1.05, .92, .95);
	spine.add(ball);
	const headB = bone("head", 0, .02, .06);
	spine.add(headB);
	const irisMesh = shell(new SphereGeometry(.16, 8, 6), iris, toon, false);
	irisMesh.position.z = .22;
	headB.add(irisMesh);
	const pupil = shell(new SphereGeometry(.07, 6, 5), 1182736, toon, false);
	pupil.position.z = .12;
	irisMesh.add(pupil);
	const catchlight = shell(new SphereGeometry(.02, 4, 3), 16051412, toon, false);
	catchlight.position.set(.04, .04, .14);
	irisMesh.add(catchlight);
	const lid = shell(box(.42, .08, .12), 1709080, toon);
	lid.position.set(0, .2, .2);
	headB.add(lid);
	const mouth = shell(box(.16, .06, .08), 6959160, toon, false);
	mouth.position.set(0, -.22, .18);
	headB.add(mouth);
	const fangGeo = new ConeGeometry(.02, .06, 4);
	const fangL = shell(fangGeo, 16051412, toon, false);
	fangL.position.set(.04, -.26, .2);
	fangL.rotation.x = Math.PI;
	const fangR = shell(fangGeo, 16051412, toon, false);
	fangR.position.set(-.04, -.26, .2);
	fangR.rotation.x = Math.PI;
	headB.add(fangL, fangR);
	const armL = bone("armL", .16, .04, 0);
	const armR = bone("armR", -.16, .04, 0);
	spine.add(armL, armR);
	const membraneGeo = new BoxGeometry(.55, .035, .32);
	const fingerGeo = new BoxGeometry(.28, .02, .16);
	const l = shell(membraneGeo, membrane, toon);
	l.position.set(.28, 0, .02);
	const l2 = shell(fingerGeo, leather, toon);
	l2.position.set(.2, -.01, -.16);
	armL.add(l, l2);
	const r = shell(membraneGeo, membrane, toon);
	r.position.set(-.28, 0, .02);
	const r2 = shell(fingerGeo, leather, toon);
	r2.position.set(-.2, -.01, -.16);
	armR.add(r, r2);
	const tail = bone("tail", 0, -.12, -.18);
	hips.add(tail);
	const stub = shell(new ConeGeometry(.06, .22, 5), leather, toon);
	stub.rotation.x = 1.2;
	tail.add(stub);
	return root;
}
/** A possessed sword and round shield. No body. The eye sits in the guard. */
function evilWeapon(toon) {
	const root = new Group();
	const steel = 9279395;
	const dark = 2761784;
	const glow = 8014544;
	const hips = bone("hips", 0, .95, 0);
	root.add(hips);
	const spine = bone("spine", 0, .05, 0);
	hips.add(spine);
	const blade = shell(box(.08, .92, .035), steel, toon);
	blade.position.y = .05;
	spine.add(blade);
	const fuller = shell(box(.02, .7, .04), glow, toon, false);
	fuller.position.y = .02;
	spine.add(fuller);
	const guard = shell(box(.36, .06, .08), 12886106, toon);
	guard.position.y = -.32;
	spine.add(guard);
	const grip = shell(new CylinderGeometry(.035, .04, .22, 5), dark, toon);
	grip.position.y = -.46;
	spine.add(grip);
	const pommel = shell(new SphereGeometry(.06, 6, 5), glow, toon, false);
	pommel.position.y = -.58;
	spine.add(pommel);
	const headB = bone("head", 0, -.28, .08);
	spine.add(headB);
	const eye = shell(new SphereGeometry(.055, 6, 5), 16051412, toon, false);
	headB.add(eye);
	const pupil = shell(new SphereGeometry(.028, 5, 4), 1708072, toon, false);
	pupil.position.z = .04;
	eye.add(pupil);
	const armL = bone("armL", .28, -.2, .02);
	hips.add(armL);
	const shield = shell(new CylinderGeometry(.16, .16, .04, 8), 4864597, toon);
	shield.rotation.x = Math.PI / 2;
	armL.add(shield);
	const boss = shell(new SphereGeometry(.045, 5, 4), glow, toon, false);
	boss.position.z = .04;
	shield.add(boss);
	const wisp = bone("seg1", 0, -.7, 0);
	hips.add(wisp);
	const mist = shell(new SphereGeometry(.1, 6, 5), 3811416, toon, false);
	mist.scale.set(1.2, .45, 1.2);
	wisp.add(mist);
	return root;
}
function orcKit(variant) {
	if (variant === "staff") return "cloth";
	if (variant === "sword") return "lizard";
	if (variant === "polearm" || variant === "scythe" || variant === "bow" || variant === "club") return "scale";
	return "bronze";
}
/** A fresh rig. The caller clones it per body. */
export function buildFieldLook(look, variant, toon) {
	let root;
	if (look === "rabbit" || look === "jack") root = rabbit(toon, look === "jack" ? 9067058 : 12887412, look === "jack");
	else if (look === "worm") root = worm(toon);
	else if (look === "bats") root = bat(toon, variant === "wind" ? .92 : 1, 3, variant === "wind" ? "dust" : "brown");
	else if (look === "bat") root = bat(toon, variant === "stirge" ? 1.2 : 1.05, 1, variant === "stirge" ? "blood" : "brown");
	else if (look === "funguar") root = funguar(toon, 12886106, 16052198);
	else if (look === "amanita") root = funguar(toon, 11022898, 16052198);
	else if (look === "crab") root = crab(toon);
	else if (look === "beetle") root = beetle(toon, variant === "armet" ? 9279652 : 4024882, false);
	else if (look === "fungus-beetle") root = beetle(toon, 6961752, true);
	else if (look === "orc") {
		root = orc(toon, orcKit(variant));
		const hand = variant === "staff" ? "staff" : variant === "fist" ? "" : variant === "polearm" ? "polearm" : variant === "bow" ? "bow" : variant === "scythe" ? "scythe" : variant === "sword" ? "sword" : variant === "club" ? "club" : "axe";
		weapon(root.getObjectByName("armR"), toon, hand);
		if (variant === "sword") weapon(root.getObjectByName("armL"), toon, "shield");
	} else if (look === "goblin") {
		root = goblin(toon);
		const hand = variant === "rod" ? "rod" : variant === "pick" ? "pick" : variant === "needle" ? "needle" : variant === "bow" ? "bow" : variant === "axe" ? "axe" : variant === "club" ? "club" : variant === "staff" ? "staff" : "dagger";
		weapon(root.getObjectByName("armR"), toon, hand);
	} else if (look === "skeleton") {
		root = humanoid(toon, 15129800, 13154468, 1.05);
		weapon(root.getObjectByName("armR"), toon, variant === "scythe" ? "scythe" : variant === "staff" ? "staff" : "sword");
	} else if (look === "hound") root = hound(toon, variant === "hati");
	else if (look === "sheep") root = sheep(toon, variant === "ram");
	else if (look === "lizard") root = lizard(toon);
	else if (look === "pugil") root = pugil(toon);
	else if (look === "warmachine") root = warmachine(toon, variant === "flame");
	else if (look === "ghost") root = ghost(toon);
	else if (look === "slime") root = slime(toon, variant === "oil" ? "oil" : variant === "mass" ? "mass" : "");
	else if (look === "sapling") root = sapling(toon, variant === "ancient");
	else if (look === "scorpion") root = scorpion(toon);
	else if (look === "hecteyes") root = hecteyes(toon);
	else if (look === "ahriman") root = ahriman(toon, variant);
	else if (look === "weapon") root = evilWeapon(toon);
	else root = bomb(toon);
	const scale = {
		rabbit: 2.15,
		jack: 2.7,
		worm: 1.6,
		bats: 2.05,
		bat: 2.35,
		funguar: 2.35,
		amanita: 3.8,
		crab: 2.65,
		beetle: 2.55,
		"fungus-beetle": 3.55,
		orc: 2,
		goblin: 1.8,
		skeleton: 2.05,
		hound: 2.25,
		sheep: 3.7,
		bomb: 2.35,
		lizard: 2.45,
		pugil: 2.35,
		warmachine: 2.55,
		ghost: 2.15,
		slime: 2.25,
		sapling: 2.55,
		scorpion: 2.45,
		hecteyes: 2.35,
		ahriman: 2.45,
		weapon: 2.2
	};
	root.userData.look = look;
	const named = look === "sheep" && variant === "ram" ? 4.4 : look === "sapling" && variant === "ancient" ? 3.7 : look === "hound" && variant === "hati" ? 2.7 : look === "scorpion" && variant === "giant" ? 3.2 : look === "slime" && variant === "mass" ? 3.15 : look === "hecteyes" && (variant === "jin" || variant === "hyaku") ? 3.35 : look === "hecteyes" && variant === "taisai" ? 2.75 : look === "ahriman" && variant === "gloom" ? 3.2 : look === "ahriman" && variant === "bat" ? 2.8 : scale[look];
	root.userData.baseScale = named;
	root.scale.setScalar(root.userData.baseScale);
	root.traverse((obj) => {
		const mesh = obj;
		if (mesh.isMesh) mesh.castShadow = false;
	});
	return root;
}
function swing(boneObj, x, z = 0) {
	if (!boneObj) return;
	boneObj.rotation.x = x;
	boneObj.rotation.z = z;
}
/** Collapse, then the yard rolls the whole rig onto its side. */
function poseDeath(root, look, t) {
	const hips = root.getObjectByName("hips");
	const spine = root.getObjectByName("spine");
	const head = root.getObjectByName("head");
	const u = Math.min(1, Math.max(0, t) / .45);
	const ease = u * u * (3 - 2 * u);
	if (hips) {
		if (hips.userData.baseY == null) hips.userData.baseY = hips.position.y;
		const base = hips.userData.baseY;
		hips.position.y = base * (1 - ease * .55) + .05 * ease;
		hips.rotation.x = .45 * ease;
		hips.rotation.y = 0;
		hips.rotation.z = 0;
	}
	swing(root.getObjectByName("armL"), .7 * ease, .9 * ease);
	swing(root.getObjectByName("armR"), .35 * ease, -1.05 * ease);
	swing(root.getObjectByName("legL"), .75 * ease);
	swing(root.getObjectByName("legR"), -.45 * ease);
	if (head) {
		head.rotation.x = .9 * ease;
		head.rotation.y = 0;
		head.rotation.z = .25 * ease;
	}
	if (spine) {
		spine.rotation.x = .35 * ease;
		spine.rotation.y = 0;
		spine.rotation.z = 0;
	}
	const tail = root.getObjectByName("tail");
	if (tail) tail.rotation.x = .9 * ease;
	const earL = root.getObjectByName("earL");
	const earR = root.getObjectByName("earR");
	if (earL) earL.rotation.z = .9 * ease;
	if (earR) earR.rotation.z = look === "jack" ? .7 : -.9 * ease;
	if (look === "slime" && hips) {
		hips.scale.set(1.4, .28 + (1 - ease) * .5, 1.4);
		hips.rotation.x = .2 * ease;
	}
	if (look === "ghost" && hips) {
		hips.position.y = (hips.userData.baseY ?? .72) * (1 - ease * .92) + .02;
		hips.rotation.z = .9 * ease;
		hips.rotation.x = .2 * ease;
	}
	if (look === "hecteyes" && hips) hips.position.y = (hips.userData.baseY ?? .7) * (1 - ease * .75) + .05;
	if (look === "ahriman" && hips) {
		hips.position.y = (hips.userData.baseY ?? .82) * (1 - ease * .88) + .04;
		hips.rotation.z = 1.05 * ease;
		hips.rotation.x = .35 * ease;
	}
	if (look === "weapon") {
		if (spine) spine.rotation.x = 1.4 * ease;
		if (hips) hips.position.y = (hips.userData.baseY ?? .95) * (1 - ease * .82) + .05;
		swing(root.getObjectByName("armL"), .9 * ease, 1.15 * ease);
	}
	if (look === "scorpion" && tail) tail.rotation.x = -.4 + 1.35 * ease;
	if (look === "sapling") {
		if (head) head.rotation.x = 1.15 * ease;
		if (spine) spine.rotation.z = .35 * ease;
	}
	if (look === "bats" || look === "bat") for (const name of [
		"armL",
		"armR",
		"wingL1",
		"wingR1",
		"wingL2",
		"wingR2"
	]) {
		const wing = root.getObjectByName(name);
		if (!wing) continue;
		const left = name.includes("L");
		wing.rotation.x = 1.15 * ease;
		wing.rotation.z = left ? .2 : -.2;
	}
	if (look === "worm") for (let i = 1; i <= 3; i++) {
		const seg = root.getObjectByName(`seg${i}`);
		if (!seg) continue;
		seg.rotation.x = .55 * ease;
		seg.rotation.z = (i % 2 === 0 ? .4 : -.4) * ease;
	}
	const flame = root.getObjectByName("flame");
	if (flame) flame.scale.setScalar(Math.max(.04, 1 - ease));
	const baseScale = typeof root.userData.baseScale === "number" ? root.userData.baseScale : 1;
	if (Math.abs(root.scale.x - baseScale) > .02) root.scale.setScalar(baseScale);
}
function poseAbility(root, look, act, u, strike, t) {
	const hips = root.getObjectByName("hips");
	const spine = root.getObjectByName("spine");
	const head = root.getObjectByName("head");
	const armL = root.getObjectByName("armL");
	const armR = root.getObjectByName("armR");
	const legL = root.getObjectByName("legL");
	const legR = root.getObjectByName("legR");
	const tail = root.getObjectByName("tail");
	const hunch = spine && typeof spine.userData.hunch === "number" ? spine.userData.hunch : 0;
	const wind = u < 0.42 ? u / 0.42 : Math.max(0, 1 - (u - 0.42) / 0.22);
	const fling = u < 0.42 ? 0 : Math.min(1, (u - 0.42) / 0.22);
	const baseY = hips ? (hips.userData.baseY ?? hips.position.y) : 0;
	const toss = act === "Fluid Toss" || act === "Bomb Toss" || act === "Stone Throw";
	if (toss) {
		if (hips) {
			hips.rotation.x = -0.95 * wind + 1.15 * fling;
			hips.rotation.y = 0;
			hips.position.z = -0.32 * wind + 0.7 * fling;
			hips.position.y = baseY + 0.16 * wind - 0.1 * fling;
			if (look === "slime" || look === "worm") {
				const tall = 1 + 0.62 * wind - 0.55 * fling;
				const wide = 1 - 0.22 * wind + 0.85 * fling;
				hips.scale.set(wide, Math.max(0.42, tall), 1 + 0.95 * fling);
			}
			const glob = root.getObjectByName("glob");
			if (glob && act === "Fluid Toss") {
				glob.scale.setScalar(0.35 + 1.35 * fling);
				glob.position.y = 0.12 + 0.28 * wind;
				glob.position.z = 0.22 + 1.7 * fling;
			}
		}
		if (look === "warmachine") {
			if (head) head.rotation.x = -1.05 * wind + 0.45 * fling;
			if (spine) spine.rotation.x = -0.35 * wind + 0.2 * fling;
		} else if (act === "Bomb Toss") {
			swing(armR, -2.7 * wind + 1.55 * fling, -0.2);
			swing(armL, 0.35 * wind, 0.25);
			if (spine) spine.rotation.x = hunch - 0.35 * wind + 0.55 * fling;
		} else {
			swing(armL, -2.15 * wind + 1.65 * fling, 0.45);
			swing(armR, -2.15 * wind + 1.65 * fling, -0.45);
		}
		if (head && look !== "warmachine") head.rotation.x = -0.55 * wind + 0.85 * fling;
		if (look === "worm") {
			if (head) head.rotation.x = -0.9 * wind + 1.45 * fling;
			for (let i = 1; i <= 3; i++) {
				const seg = root.getObjectByName(`seg${i}`);
				if (!seg) continue;
				seg.rotation.x = -0.65 * fling * (i / 3) + 0.2 * wind;
				seg.rotation.z = Math.sin(u * Math.PI + i) * 0.2 * wind;
			}
		}
		return;
	}
	if (act === "Ooze") {
		if (hips) {
			const blob = 1 + 0.85 * strike;
			hips.scale.set(blob, Math.max(0.4, 1.2 - 0.7 * strike), blob);
			hips.position.z = 0.42 * strike;
			hips.position.y = baseY - 0.12 * strike;
			hips.rotation.x = 0.55 * strike;
		}
		swing(armL, 0.8 * strike, 1.2 * strike);
		swing(armR, 0.8 * strike, -1.2 * strike);
		return;
	}
	if (act === "Sandspin" || act === "Spinning Attack" || act === "Screwdriver" || act === "Binding Wave") {
		if (hips) hips.rotation.y = u * Math.PI * (act === "Binding Wave" ? 2 : 4);
		if (act === "Screwdriver" && hips) hips.position.y = baseY - 0.12 * strike;
		swing(armL, act === "Binding Wave" ? -0.4 : -0.8, 1.1);
		swing(armR, act === "Binding Wave" ? -0.4 : -0.8, -1.1);
		if (look === "worm") {
			for (let i = 1; i <= 3; i++) {
				const seg = root.getObjectByName(`seg${i}`);
				if (seg) seg.rotation.z = Math.sin(u * Math.PI * 6 + i) * 0.9;
			}
		}
		if (look === "pugil" && tail) tail.rotation.y = u * 8;
		return;
	}
	if (act === "Foot Kick" || act === "Frogkick") {
		const kick = 1.7 * strike;
		swing(legR, -kick);
		swing(legL, act === "Frogkick" ? -kick : 0.2);
		if (hips) {
			hips.rotation.x = -kick * 0.35;
			hips.position.z = 0.2 * strike;
		}
		if (head) head.rotation.x = 0.35 * strike;
		swing(armL, -0.4, 0.2);
		swing(armR, -0.4, -0.2);
		return;
	}
	if (act === "Whistle" || act === "Howl" || act === "Sheep Song" || act === "Rage" || act === "Wild Carrot" || act === "Rhino Guard" || act === "Heavy Armature" || act === "Flame Armor" || act === "Water Wall") {
		if (head) head.rotation.x = act === "Wild Carrot" ? 0.9 * strike : -1.15 * strike;
		if (hips) {
			hips.rotation.x = (act === "Rage" ? 0.15 : -0.45) * strike;
			hips.position.y = baseY + (act === "Rage" ? Math.abs(Math.sin(u * Math.PI * 4)) * 0.16 : 0.08 * strike);
			hips.position.z = act === "Rhino Guard" || act === "Heavy Armature" ? -0.12 * strike : 0;
			if (act === "Flame Armor" || act === "Water Wall") {
				const swell = 1 + 0.18 * strike;
				hips.scale.set(swell, swell, swell);
			}
		}
		if (spine) spine.rotation.x = hunch + (act === "Rhino Guard" ? 0.45 : -0.35) * strike;
		swing(armL, act === "Wild Carrot" ? 0.4 : -1.4 * strike, 0.35);
		swing(armR, act === "Wild Carrot" ? 0.4 : -1.4 * strike, -0.35);
		if (tail && act === "Howl") tail.rotation.x = -1.1 * strike;
		if (act === "Flame Armor") {
			const flame = root.getObjectByName("flame");
			if (flame) flame.scale.set(1.8 + strike, 2.4 + strike, 1.8 + strike);
		}
		return;
	}
	if (act === "Dust Cloud" || act === "Stinking Gas" || act === "Silence Gas" || act === "Spoil" || act === "Black Cloud" || act === "Sonic Wave") {
		const shake = Math.sin(t * 28) * 0.35 * Math.min(1, u * 2);
		if (hips) {
			hips.rotation.z = shake;
			hips.position.y = baseY + Math.abs(shake) * 0.2;
			const puff = 1 + 0.28 * strike;
			if (look === "funguar" || look === "amanita" || look === "beetle" || look === "fungus-beetle" || look === "slime") hips.scale.set(puff, 1.15 - 0.2 * strike, puff);
		}
		if (head) head.rotation.z = -shake;
		if (spine) spine.rotation.y = shake * 0.8;
		swing(armL, -0.6, 0.9 + shake);
		swing(armR, -0.6, -0.9 - shake);
		return;
	}
	if (act === "Blood Drain" || act === "Suction" || act === "Terror Touch") {
		if (hips) {
			hips.rotation.x = 0.85 * strike;
			hips.position.z = 0.48 * strike;
			hips.position.y = baseY - 0.06 * strike;
		}
		swing(armL, 0.9 * strike, 0.7);
		swing(armR, 0.9 * strike, -0.7);
		if (head) head.rotation.x = 0.6 * strike;
		if (spine) spine.rotation.x = hunch + 0.4 * strike;
		return;
	}
	if (act === "Big Scissors" || act === "Death Scissors" || act === "Pincer" || act === "Claw Cyclone" || act === "Dirty Claw" || act === "Venom Sting") {
		const open = wind;
		const snap = fling;
		const wide = act === "Death Scissors" || act === "Claw Cyclone" ? 1.6 : 1.25;
		swing(armL, 0.15, wide * open - 1.35 * snap);
		swing(armR, 0.15, -wide * open + 1.35 * snap);
		if (hips) {
			hips.rotation.y = act === "Claw Cyclone" ? u * Math.PI * 3 : 0;
			hips.position.z = 0.22 * snap;
		}
		if (act === "Venom Sting" && tail) tail.rotation.x = -1.5 * wind + 0.4 * fling;
		if (head) head.rotation.x = 0.45 * snap;
		return;
	}
	if (act === "Shoulder Tackle" || act === "Goblin Rush" || act === "Sheep Charge" || act === "Ram Charge" || act === "Rhino Attack" || act === "Blockhead") {
		if (hips) {
			hips.rotation.x = 0.95 * strike;
			hips.rotation.y = 0;
			hips.position.z = 0.72 * strike;
			hips.position.y = baseY - 0.1 * strike;
		}
		if (spine) spine.rotation.x = hunch + 0.65 * strike;
		if (head) head.rotation.x = act === "Blockhead" || act === "Rhino Attack" || act === "Sheep Charge" || act === "Ram Charge" ? 1.15 * strike : 0.35 * strike;
		swing(armL, 0.5 * strike, act === "Shoulder Tackle" ? 0.2 : 0.45);
		swing(armR, act === "Shoulder Tackle" ? -0.2 : 0.5 * strike, act === "Shoulder Tackle" ? -0.15 : -0.45);
		swing(legL, -0.55 * strike);
		swing(legR, 0.35 * strike);
		return;
	}
	if (act === "Backhand Blow" || act === "Slam Dunk" || act === "Shield Bash" || act === "Shield Strike" || act === "Blood Saber" || act === "Arcane Stomp" || act === "Branch Swipe") {
		if (act === "Slam Dunk" || act === "Arcane Stomp") {
			const up = wind;
			const down = fling;
			if (hips) {
				hips.position.y = baseY + 0.42 * up - 0.18 * down;
				hips.rotation.x = -0.4 * up + 0.7 * down;
				hips.position.z = 0.2 * down;
			}
			swing(armL, -2.4 * up + 1.4 * down, 0.3);
			swing(armR, -2.4 * up + 1.4 * down, -0.3);
			if (head) head.rotation.x = -0.4 * up + 0.8 * down;
		} else if (act === "Shield Bash" || act === "Shield Strike") {
			swing(armL, -0.4 + 1.6 * fling, 0.2);
			swing(armR, -0.3 * wind, -0.2);
			if (hips) {
				hips.position.z = 0.28 * fling;
				hips.rotation.y = -0.35 * wind + 0.15 * fling;
			}
		} else {
			const sweep = Math.sin(u * Math.PI);
			swing(armR, -0.6, -1.7 * sweep);
			swing(armL, act === "Branch Swipe" ? -0.4 : 0.3, act === "Branch Swipe" ? 1.3 * sweep : 0.2);
			if (hips) hips.rotation.y = sweep * (act === "Blood Saber" ? 1.4 : 0.9);
			if (spine) spine.rotation.y = sweep * 0.45;
			if (head && act === "Branch Swipe") head.rotation.z = sweep * 0.35;
		}
		return;
	}
	if (act === "Sharp Shot" || act === "Wing Cutter" || act === "Swooping Frenzy") {
		if (act === "Sharp Shot") {
			swing(armL, -0.7 * wind - 0.2 * fling, 0.85 * wind);
			swing(armR, -1.5 * wind + 1.8 * fling, -0.15);
			if (spine) spine.rotation.y = -0.45 * wind + 0.15 * fling;
			if (head) head.rotation.x = -0.15;
		} else {
			const dive = act === "Swooping Frenzy" ? 1 : 0.65;
			if (hips) {
				hips.rotation.x = dive * strike;
				hips.position.y = baseY - 0.22 * strike * dive;
				hips.position.z = 0.35 * strike;
			}
			swing(armL, 0.2, 1.35 * wind - 0.2 * fling);
			swing(armR, 0.2, -1.35 * wind + 0.2 * fling);
			for (const name of ["wingL1", "wingR1", "wingL2", "wingR2"]) {
				const wing = root.getObjectByName(name);
				if (!wing) continue;
				const left = name.includes("L");
				wing.rotation.z = left ? 0.35 + strike * dive : -(0.35 + strike * dive);
				wing.rotation.x = 0.8 * strike;
			}
		}
		return;
	}
	if (act === "Dark Spore" || act === "Leafstorm") {
		const shake = Math.sin(t * 18) * 0.32 * Math.min(1, u * 2);
		if (hips) hips.rotation.z = shake;
		if (head) {
			head.rotation.x = -0.55;
			head.rotation.z = shake;
		}
		swing(armL, -1.15, 1.15 + shake);
		swing(armR, -1.15, -1.15 - shake);
		if (spine) spine.rotation.y = act === "Leafstorm" ? u * Math.PI * 3 : shake;
		return;
	}
	if (act === "Arm Cannon") {
		if (head) head.rotation.x = -0.35 * wind + 0.9 * fling;
		if (spine) spine.rotation.x = -0.2 * wind + 0.28 * fling;
		if (hips) hips.position.z = -0.12 * wind + 0.18 * fling;
		const flame = root.getObjectByName("flame");
		if (flame) flame.scale.set(1.3 + fling, 1.6 + fling * 2.2, 1.3 + fling);
		return;
	}
	if (act === "Tail Blow") {
		if (tail) tail.rotation.x = -1.55 * wind + 0.85 * fling;
		if (hips) hips.rotation.y = 0.9 * wind - 0.4 * fling;
		if (spine) spine.rotation.x = -0.25 * wind;
		return;
	}
	if (act === "Nightmare" || act === "Hypnosis" || act === "Hex Eye" || act === "Sleep") {
		const sway = Math.sin(u * Math.PI * 2) * 0.45;
		if (head) {
			head.rotation.y = sway;
			head.rotation.x = -0.35;
		}
		if (hips) hips.position.y = baseY + 0.12 + Math.sin(t * 3) * 0.05;
		swing(armL, -0.8, 0.7 + sway * 0.3);
		swing(armR, -0.8, -0.7 - sway * 0.3);
		if (spine) spine.rotation.z = sway * 0.25;
		return;
	}
	if (act === "Drain") {
		if (hips) {
			hips.rotation.x = 0.7 * Math.min(1, u * 1.4);
			hips.position.z = 0.36 * Math.min(1, u * 1.4);
		}
		swing(armL, 1.1 * Math.min(1, u), 0.45);
		swing(armR, 1.1 * Math.min(1, u), -0.45);
		if (head) head.rotation.x = 0.45;
		return;
	}
	if (act === "Cure" || act === "Cure II" || act === "Photosynthesis") {
		const lift = Math.min(1, u / 0.7);
		if (hips) hips.position.y = baseY + 0.14 * lift;
		swing(armL, -2.3 * lift, 0.45);
		swing(armR, -2.3 * lift, -0.45);
		if (head) head.rotation.x = -0.65 * lift;
		if (spine) spine.rotation.x = hunch - 0.4 * lift;
		return;
	}
	if (act === "Protect") {
		const guard = Math.min(1, u / 0.55);
		swing(armL, -1.2 * guard, 0.95 * guard);
		swing(armR, -1.2 * guard, -0.95 * guard);
		if (spine) spine.rotation.x = hunch + 0.15 * guard;
		if (head) head.rotation.x = 0.2 * guard;
		return;
	}
	if (act === "Stone" || act === "Stone II") {
		if (hips) hips.position.y = baseY - 0.08 * wind + 0.05 * fling;
		swing(armL, -1.2 * wind + 1.4 * fling, 0.25);
		swing(armR, -1.2 * wind + 1.4 * fling, -0.25);
		if (spine) spine.rotation.x = hunch + 0.55 * fling;
		return;
	}
	if (act === "Water" || act === "Water II" || act === "Aqua Ball" || act === "Bubble Shower") {
		const sway = Math.sin(u * Math.PI * 3) * 0.4;
		if (spine) spine.rotation.z = sway;
		swing(armL, -1.5, 0.6 + sway);
		swing(armR, -1.5, -0.6 + sway);
		return;
	}
	if (act === "Aero" || act === "Jet Stream") {
		if (hips) hips.rotation.y = Math.sin(u * Math.PI * 2) * 0.7;
		swing(armL, -0.5, 1.3 * Math.min(1, u * 1.4));
		swing(armR, -0.5, -1.3 * Math.min(1, u * 1.4));
		return;
	}
	if (act === "Fire" || act === "Fireball" || act === "Heat Wave") {
		const shake = Math.sin(t * 22) * 0.18 * Math.min(1, u * 2);
		if (hips) hips.rotation.z = shake;
		swing(armL, -2.1, 0.55 + shake);
		swing(armR, -2.1, -0.55 - shake);
		if (head) head.rotation.x = -0.4;
		return;
	}
	if (act === "Blizzard" || act === "Blizzard III") {
		const spread = Math.min(1, u / 0.75);
		swing(armL, -0.4 * (1 - spread) - 1.2 * spread, 1.15 * spread);
		swing(armR, -0.4 * (1 - spread) - 1.2 * spread, -1.15 * spread);
		if (spine) spine.rotation.x = hunch + 0.35 * (1 - spread);
		return;
	}
	if (act === "Thunder") {
		const snap = u < 0.72 ? u / 0.72 : 1;
		if (hips) hips.position.y = baseY + 0.18 * snap;
		swing(armL, -2.5 * snap, 0.15);
		swing(armR, -2.5 * snap, -0.15);
		if (head) head.rotation.x = -0.8 * snap;
		return;
	}
	if (act === "Poison" || act === "Bio" || act === "Blind" || act === "Dia" || act === "Banish") {
		const point = Math.min(1, u / 0.65);
		swing(armR, -1.7 * point, -0.15);
		swing(armL, -0.4 * point, 0.35);
		if (spine) spine.rotation.y = -0.25 * point;
		if (head) head.rotation.x = -0.2 * point;
		return;
	}
	if (act === "Cataract" || act === "Death Ray" || act === "Eyes On Me" || act === "Mind Break" || act === "Winds of Oblivion") {
		const beam = Math.min(1, u / 0.8);
		if (head) head.rotation.x = -0.15 + 0.15 * Math.sin(t * 16) * beam;
		if (spine) spine.rotation.x = -0.25 * beam;
		swing(armL, -0.3, 0.95 * beam);
		swing(armR, -0.3, -0.95 * beam);
		if (hips) hips.position.y = baseY + 0.08 * beam;
	}
}

/** Patrol trot, a separate auto, a separate TP move, a cast, and the bomb's swell. `t` is seconds. */
export function poseField(root, motion, t, act = "") {
	const look = root.userData.look;
	const dead = motion === "dead";
	if (dead) {
		poseDeath(root, look, t);
		return;
	}
	const step = Math.sin(t * Math.PI * 2);
	const bob = Math.sin(t * Math.PI * 4);
	const hips = root.getObjectByName("hips");
	const spine = root.getObjectByName("spine");
	const hunch = spine && typeof spine.userData.hunch === "number" ? spine.userData.hunch : 0;
	const head = root.getObjectByName("head");
	const armL = root.getObjectByName("armL");
	const armR = root.getObjectByName("armR");
	const legL = root.getObjectByName("legL");
	const legR = root.getObjectByName("legR");
	const earL = root.getObjectByName("earL");
	const earR = root.getObjectByName("earR");
	const tail = root.getObjectByName("tail");
	const walking = motion === "walk";
	const attack = motion === "attack";
	const skill = motion === "skill";
	const casting = motion === "cast";
	const boom = motion === "boom";
	const u = Math.max(0, Math.min(1, t / (casting ? 1.15 : skill ? .85 : boom ? .9 : .7)));
	const strike = u < .42 ? u / .42 : Math.max(0, 1 - (u - .42) / .58);
	const chant = Math.min(1, u / .72);
	const release = u > .72 ? (u - .72) / .28 : 0;
	const flying = look === "bats" || look === "bat" || look === "ahriman";
	const drifting = look === "ghost" || look === "hecteyes" || look === "weapon";
	const human = look === "orc" || look === "goblin" || look === "skeleton";
	const rabbitLike = look === "rabbit" || look === "jack";
	if (hips) {
		if (hips.userData.baseY == null) hips.userData.baseY = hips.position.y;
		const base = hips.userData.baseY;
		hips.position.y = base + (walking ? Math.abs(bob) * .04 : bob * .012);
		hips.position.z = attack ? .16 * strike : skill ? .28 * strike : 0;
		hips.rotation.x = 0;
		hips.rotation.y = 0;
		hips.rotation.z = dead ? Math.min(1.25, t * 2) : 0;
		hips.scale.set(1, 1, 1);
	}
	const stride = walking ? step * .7 : 0;
	if (!flying && !drifting) {
		swing(legL, stride);
		swing(legR, -stride);
		swing(armL, -stride * .6);
		swing(armR, stride * .6);
	}
	if (head) {
		head.rotation.x = walking ? bob * .08 : 0;
		head.rotation.y = 0;
		head.rotation.z = 0;
	}
	if (spine) {
		spine.rotation.x = hunch;
		spine.rotation.y = 0;
		spine.rotation.z = 0;
	}
	if (tail) tail.rotation.x = walking ? step * .35 : Math.sin(t * 2) * .15;
	if (attack || skill) {
		if (rabbitLike) {
			const kick = (skill ? 1.55 : .85) * strike;
			swing(legL, skill ? -.25 : -kick * .45);
			swing(legR, -kick);
			if (hips) hips.rotation.x = -kick * .32;
			if (head) head.rotation.x = skill ? -.55 * strike : .25 * strike;
			swing(armL, skill ? -1.25 * strike : -.35 * strike);
			swing(armR, skill ? -1.25 * strike : -.35 * strike);
		} else if (look === "worm") {
			if (head) head.rotation.x = (skill ? .25 : 1.15) * strike;
			if (hips) hips.position.y += (skill ? .06 : .24) * strike;
		} else if (look === "funguar" || look === "amanita") {
			if (head) head.rotation.x = (skill ? .95 : .55) * strike;
			if (hips) hips.position.y += (skill ? .18 : .06) * strike;
			swing(legL, -.55 * strike);
			swing(legR, skill ? .2 : -.55 * strike);
		} else if (look === "crab") {
			if (skill) {
				swing(armL, -.35, 1.2 * strike);
				swing(armR, -.35, -1.2 * strike);
			} else {
				swing(armL, .15, .2);
				swing(armR, -.15, -1.25 * strike);
			}
		} else if (look === "beetle" || look === "fungus-beetle") {
			if (head) head.rotation.x = (skill ? .4 : 1.2) * strike;
			if (hips) hips.rotation.x = -(skill ? .2 : .6) * strike;
			swing(armL, skill ? -.9 * strike : -.15);
			swing(armR, skill ? .9 * strike : -.15);
		} else if (human) {
			if (skill) {
				swing(armL, -2.25 * strike, .4 * strike);
				swing(armR, -2.25 * strike, -.4 * strike);
				if (spine) spine.rotation.x = hunch + .4 * strike;
				if (hips) hips.rotation.y = Math.sin(u * Math.PI * 2) * .55;
			} else {
				swing(armR, -.35 - 2.15 * strike);
				swing(armL, .25 * strike);
				if (spine) spine.rotation.x = hunch + .22 * strike;
			}
		} else if (look === "hound") {
			if (skill) {
				if (head) head.rotation.x = -.95 * strike;
				if (spine) spine.rotation.x = -.4 * strike;
				if (tail) tail.rotation.x = -.9 * strike;
				swing(armL, -1.05 * strike);
				swing(armR, -1.05 * strike);
			} else {
				if (head) head.rotation.x = 1.05 * strike;
				if (spine) spine.rotation.x = .45 * strike;
			}
		} else if (look === "sheep") {
			if (skill) {
				if (head) head.rotation.x = -1.2 * strike;
				if (hips) {
					hips.rotation.x = -.7 * strike;
					hips.position.y += .18 * strike;
				}
				swing(legL, -1.05 * strike);
				swing(legR, .4 * strike);
			} else {
				if (head) head.rotation.x = .95 * strike;
				if (hips) {
					hips.rotation.x = -.5 * strike;
					hips.position.y += .04 * strike;
				}
				swing(legL, -.75 * strike);
				swing(legR, .45 * strike);
			}
		} else if (look === "bomb") {
			swing(armL, -1.15 * strike, .45 * strike);
			swing(armR, -1.15 * strike, -.45 * strike);
		} else if (look === "lizard") {
			if (skill) {
				if (tail) tail.rotation.x = -1.35 * strike;
				if (hips) hips.rotation.y = .85 * strike;
			} else {
				if (head) head.rotation.x = 1.05 * strike;
				if (spine) spine.rotation.x = .4 * strike;
			}
		} else if (look === "pugil") {
			if (skill) {
				if (hips) hips.rotation.y = Math.sin(u * Math.PI * 2) * 1.15;
				swing(armL, -.2, .9 * strike);
				swing(armR, -.2, -.9 * strike);
			} else if (head) head.rotation.x = .95 * strike;
		} else if (look === "warmachine") {
			if (head) head.rotation.x = (skill ? 1.05 : .62) * strike;
			if (spine) spine.rotation.x = -.18 * strike;
		} else if (look === "ghost") {
			swing(armL, skill ? -1.7 * strike : -.4, skill ? .9 * strike : .7 * strike);
			swing(armR, skill ? -1.7 * strike : -.4, skill ? -.9 * strike : -.7 * strike);
			if (spine) spine.rotation.x = (skill ? -.45 : .7) * strike;
			if (head) head.rotation.x = (skill ? -.6 : .4) * strike;
			if (hips) hips.position.y += (skill ? .08 : .16) * strike;
		} else if (look === "slime") {
			swing(armL, skill ? -.2 : -.8 * strike, skill ? 1.1 * strike : .4);
			swing(armR, skill ? -.2 : -.8 * strike, skill ? -1.1 * strike : -.4);
			if (hips) {
				hips.rotation.x = (skill ? -.15 : .45) * strike;
				const squash = 1 - (skill ? .12 : .28) * strike;
				hips.scale.set(2 - squash, squash, 2 - squash);
			}
		} else if (look === "sapling") {
			swing(armL, skill ? -2.1 * strike : -.3, skill ? .2 : .8 * strike);
			swing(armR, skill ? -2.1 * strike : -1.6 * strike, skill ? -.2 : -.3);
			if (spine) spine.rotation.x = (skill ? .35 : .2) * strike;
			if (head) head.rotation.x = (skill ? -.4 : .25) * strike;
		} else if (look === "scorpion") {
			if (skill) {
				if (tail) tail.rotation.x = -1.35 * strike;
				if (spine) spine.rotation.x = -.25 * strike;
			} else {
				swing(armL, .2, 1.15 * strike);
				swing(armR, .2, -.35);
				if (head) head.rotation.x = .4 * strike;
			}
		} else if (look === "hecteyes") {
			if (head) head.rotation.y = skill ? Math.sin(u * Math.PI * 2) * .8 : 0;
			if (spine) spine.rotation.x = (skill ? -.2 : .7) * strike;
			swing(armL, skill ? -1.2 * strike : -.4, .6 * strike);
			swing(armR, skill ? -1.2 * strike : -.4, -.6 * strike);
			if (hips) hips.position.y += (skill ? .1 : -.18) * strike;
		} else if (look === "weapon") {
			if (spine) spine.rotation.z = (skill ? .2 : -1.35) * strike;
			if (spine) spine.rotation.x = (skill ? -.85 : .35) * strike;
			swing(armL, skill ? -.4 : .2, skill ? 1.25 * strike : .3);
			if (head) head.rotation.x = .4 * strike;
		}
	}
	if (look === "worm") {
		for (let i = 1; i <= 3; i++) {
			const seg = root.getObjectByName(`seg${i}`);
			if (!seg) continue;
			if (skill) {
				seg.rotation.z = Math.sin(u * Math.PI * 3 + i) * .75;
				seg.rotation.x = .15;
			} else if (attack) {
				seg.rotation.z = Math.sin(t * 6) * .08;
				seg.rotation.x = -.5 * strike * (i / 3);
			} else if (casting) {
				seg.rotation.z = Math.sin(t * 5 + i) * .22 * chant;
				seg.rotation.x = -.18 * chant;
			} else {
				seg.rotation.z = Math.sin(t * 4.2 + i * .8) * .32;
				seg.rotation.x = Math.cos(t * 3.1 + i) * .2;
			}
		}
		if (head && !attack && !skill) head.rotation.z = Math.sin(t * 3.6) * .24;
	}
	if (casting && !flying) {
		const lift = chant * (1 - release * .25);
		if (human) {
			swing(armL, -2.45 * lift, .3);
			swing(armR, -2.65 * lift, -.2);
			if (spine) spine.rotation.x = hunch - .28 * lift;
			if (head) head.rotation.x = -.5 * lift + release * .7;
		} else if (look === "funguar" || look === "amanita") {
			if (head) {
				head.rotation.x = -.75 * lift + release * .4;
				head.rotation.z = Math.sin(t * 9) * .18 * lift;
			}
			if (hips) hips.position.y += .14 * lift;
		} else if (look === "crab") {
			swing(armL, -1.5 * lift, .55 * lift);
			swing(armR, -1.5 * lift, -.55 * lift);
			if (hips) hips.position.y += .1 * lift;
		} else if (look === "bomb") {
			if (spine) spine.rotation.z = Math.sin(t * 16) * .22 * lift;
			swing(armL, -.7 * lift, .85 * lift);
			swing(armR, -.7 * lift, -.85 * lift);
		} else if (look === "weapon") {
			if (spine) spine.rotation.x = -.55 * lift;
			swing(armL, -.8 * lift, .9 * lift);
			if (head) head.rotation.x = -.35 * lift + release * .5;
			const mist = root.getObjectByName("seg1");
			if (mist) mist.scale.setScalar(1 + lift * .45);
		} else {
			swing(armL, -1.7 * lift);
			swing(armR, -1.7 * lift);
			if (head) head.rotation.x = -.55 * lift;
		}
	}
	if (flying) {
		const flap = Math.sin(t * (walking ? 10 : attack || skill ? 14 : 7));
		if (look === "ahriman") {
			const spread = attack ? .35 + strike * .9 : skill ? 1.15 - strike * .2 : casting ? .95 : .55 + flap * .22;
			swing(armL, attack ? .7 * strike : skill ? -.45 * strike : casting ? -.35 * chant : .08, spread);
			swing(armR, attack ? .7 * strike : skill ? -.45 * strike : casting ? -.35 * chant : .08, -spread);
			if (spine) spine.rotation.x = attack ? .65 * strike : skill ? -.25 * strike : casting ? -.4 * chant : 0;
			if (head) {
				head.rotation.y = skill ? Math.sin(u * Math.PI * 4) * .35 : casting ? 0 : t * .35;
				head.rotation.x = attack ? .45 * strike : casting ? -.5 * chant + release * .55 : 0;
			}
			if (hips && !dead) {
				const base = hips.userData.baseY ?? hips.position.y;
				hips.position.y = base + Math.sin(t * (walking ? 3.4 : 1.6)) * .07 + (attack ? -.16 * strike : skill ? .08 * strike : 0);
			}
			if (tail) tail.rotation.x = 1.2 + Math.sin(t * 2) * .15;
		} else {
			const lift = attack ? .2 + (1 - strike) * .95 : skill ? .25 + strike * 1.2 : .62 + flap * (casting ? .55 : .28);
			for (const name of [
				"armL",
				"armR",
				"wingL1",
				"wingR1",
				"wingL2",
				"wingR2"
			]) {
				const wing = root.getObjectByName(name);
				if (!wing) continue;
				const left = name.includes("L");
				wing.rotation.x = attack ? .95 * strike : skill ? -.35 * strike : .12;
				wing.rotation.z = left ? lift : -lift;
			}
			if (spine) {
				spine.rotation.y = skill ? Math.sin(u * Math.PI * 2) * .7 : flap * .08;
				spine.rotation.x = attack ? .85 * strike : casting ? -.45 * chant : 0;
			}
			if (head) head.rotation.x = attack ? .7 * strike : casting ? -.55 * chant + release * .4 : 0;
			for (let i = 1; i <= 2; i++) {
				const seg = root.getObjectByName(`seg${i}`);
				if (seg) seg.rotation.z = Math.sin(t * 7 + i) * (attack ? .05 : .12);
			}
			if (hips && !dead) {
				const base = hips.userData.baseY;
				hips.position.y = base + Math.sin(t * 3) * .06 + (attack ? -.32 * strike : 0);
			}
		}
	}
	if (earL) earL.rotation.z = .05 + (skill || attack ? strike : step) * .16;
	if (earR) earR.rotation.z = (look === "jack" ? .7 : -.05) - (skill || attack ? strike : step) * .16;
	if (look === "lizard" && !attack && !skill && !casting && !dead && tail) tail.rotation.x = Math.sin(t * 2.1) * .22 + (walking ? step * .35 : 0);
	if (look === "pugil" && !attack && !skill && !casting && !dead) {
		const flap = Math.sin(t * (walking ? 8 : 3.2));
		swing(armL, .15, .4 + flap * .4);
		swing(armR, .15, -.4 - flap * .4);
		if (tail) tail.rotation.y = flap * .35;
	}
	if (look === "warmachine") {
		const roll = walking ? t * 7 : 0;
		for (const name of ["wheelL", "wheelR"]) {
			const hub = root.getObjectByName(name);
			if (hub) hub.rotation.x = roll;
		}
		if (!attack && !skill && !casting && !dead && head) head.rotation.x = walking ? Math.abs(step) * .08 : Math.sin(t * 1.3) * .04;
		if (walking && hips) hips.rotation.z = step * .05;
		const flame = root.getObjectByName("flame");
		if (flame) {
			const flare = attack || skill ? 1.35 + strike * .7 : .85 + Math.sin(t * 9) * .18;
			flame.scale.set(flare, flare * (attack || skill ? 1.6 : 1), flare);
			flame.rotation.z = Math.sin(t * 14) * .25;
		}
	}
	if (look === "ghost" && !dead && !attack && !skill && !casting) {
		if (spine) spine.rotation.z = Math.sin(t * 1.6) * .08;
		if (hips) {
			const base = hips.userData.baseY ?? hips.position.y;
			hips.position.y = base + Math.sin(t * (walking ? 3.2 : 1.7)) * (walking ? .08 : .05);
		}
		const wisp = root.getObjectByName("seg1");
		if (wisp) wisp.rotation.z = Math.sin(t * 2.4) * .35;
	}
	if (look === "slime" && hips && !dead && !attack && !skill && !casting) {
		const squash = 1 + Math.sin(t * (walking ? 7 : 2.2)) * (walking ? .12 : .05);
		hips.scale.set(1 + (1 - squash) * .55, squash, 1 + (1 - squash) * .55);
	}
	if (look === "sapling" && !dead && !attack && !skill && !casting) {
		if (spine) spine.rotation.z = Math.sin(t * 1.3) * (walking ? .05 : .08);
		if (head) head.rotation.z = Math.sin(t * 1.3 + .4) * .06;
		swing(armL, walking ? stride * .3 : Math.sin(t * 1.1) * .08, .15);
		swing(armR, walking ? -stride * .3 : Math.sin(t * 1.1 + 1) * .08, -.15);
	}
	if (look === "scorpion" && !dead) {
		if (!attack && !skill && !casting && tail) tail.rotation.x = -.55 + Math.sin(t * 1.8) * .12;
		const extra = Math.sin(t * (walking ? 8 : 2));
		const seg1 = root.getObjectByName("seg1");
		const seg2 = root.getObjectByName("seg2");
		if (seg1) seg1.rotation.z = (walking ? stride : 0) + extra * .15;
		if (seg2) seg2.rotation.z = (walking ? -stride : 0) - extra * .15;
	}
	if (look === "hecteyes" && !dead && !attack && !skill && !casting) {
		if (head) head.rotation.y = t * .55;
		if (hips) {
			const base = hips.userData.baseY ?? hips.position.y;
			hips.position.y = base + Math.sin(t * (walking ? 3 : 1.5)) * .06;
		}
		swing(armL, .15, .35 + Math.sin(t * 2.2) * .25);
		swing(armR, .15, -.35 - Math.sin(t * 2.2) * .25);
	}
	if (look === "weapon" && !dead && !attack && !skill && !casting) {
		if (spine) {
			spine.rotation.z = Math.sin(t * (walking ? 2.4 : .9)) * (walking ? .18 : .08);
			spine.rotation.x = walking ? .12 : Math.sin(t * 1.3) * .05;
		}
		swing(armL, .15, .55 + Math.sin(t * 1.7) * .18);
		if (hips) {
			const base = hips.userData.baseY ?? hips.position.y;
			hips.position.y = base + Math.sin(t * (walking ? 3.2 : 1.4)) * .06;
		}
		const mist = root.getObjectByName("seg1");
		if (mist) mist.rotation.y = t * .8;
	}
	const baseScale = typeof root.userData.baseScale === "number" ? root.userData.baseScale : 1;
	if (look === "bomb") {
		const swell = boom ? 1 + Math.min(1, t) * .55 : casting ? 1 + chant * .2 : attack || skill ? 1 + strike * .08 : 1;
		root.scale.setScalar(baseScale * swell);
		const spark = root.getObjectByName("spark");
		if (spark) spark.rotation.y = t * (casting || boom ? 14 : 6);
	} else if (Math.abs(root.scale.x - baseScale) > .02) root.scale.setScalar(baseScale);
	const glob = root.getObjectByName("glob");
	if (glob) glob.scale.setScalar(.001);
	if (act) poseAbility(root, look, act, u, strike, t);
}
