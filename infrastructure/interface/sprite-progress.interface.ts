export type SpriteLevel = 1 | 2 | 3 | 4 | 5;

export interface SpriteProgress {
    sprite_id:string,
    level: SpriteLevel,
    is_mastered: boolean,
    unlocked_at: string ,
    mastered_at: string | null,
}
