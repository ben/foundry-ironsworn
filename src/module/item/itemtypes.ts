import { RANKS } from "../constants";

interface ProgressBase {
    rank: keyof typeof RANKS
    current: number
}

///////////////////////////////

interface AssetField {
    name: string
    value: string
}

interface AssetAbility {
    enabled: boolean
    description: string
}

interface AssetExclusiveOption {
    name: string,
    selected: boolean
}

interface AssetData {
    fields: AssetField[]
    abilities: AssetAbility[]
    track: {
        enabled: boolean
        name: string
        current: number
        max: number
    }
    exclusiveOptions: AssetExclusiveOption[]
}

export interface AssetItemData extends Item.Data<AssetData> {
    type: "asset"
}

///////////////////////////////

interface ProgressData extends ProgressBase {
}

export interface ProgressItemData extends Item.Data<ProgressData> {
    type: "progress"
}

///////////////////////////////

interface VowData extends ProgressBase {
    description: string
    threat: string
    menace: number
}

export interface VowItemData extends Item.Data<VowData> {
    type: "vow"
}

///////////////////////////////

interface Bond {
    name: string
    notes: string
}

interface BondsetData {
    bonds: Bond[]
}

export interface BondsetItemData extends Item.Data<BondsetData> {
    type: "bondset"
}

///////////////////////////////

interface SiteData extends ProgressBase {
    objective: string
    theme: string
    domain: string
    notes: string
}

export interface SiteItemData extends Item.Data<SiteData> {
    type: "site"
}

///////////////////////////////

interface MoveData {
}

export interface MoveItemData extends Item.Data<MoveData> {
    type: "asset"
}

///////////////////////////////

export type IronswornItemData = AssetItemData | ProgressItemData | VowItemData | BondsetItemData | SiteItemData | MoveItemData