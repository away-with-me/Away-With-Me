export const DEBUG = new URL(window.location).searchParams.has("debug")

export const PLAYER_DX = 100;
export const PLAYER_DY = 160;

export const CANVAS_WIDTH = 16 * 26;
export const CANVAS_HEIGHT = 16 * 9;

export const WORLD_HEIGHT = 256;

export const SHADOW_DX = 25;
export const SHADOW_FOLLOW_DISTANCE = 100;

export const GROUND_LEVEL = WORLD_HEIGHT - 16;

export const DEPTH_BACKGROUND = 100;
export const DEPTH_TILES = 200;
export const DEPTH_PLAYER = 300;
export const DEPTH_FOREGROUND = 400;
export const DEPTH_SHADOW_WALL = 500;
export const DEPTH_ABOVE_SHADOW = 600;
export const DEPTH_DEBUG = 1000;

export const GRAVITY_STRENGTH = 250;
