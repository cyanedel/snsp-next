export interface PostItem {
  id: number,
  title: string,
  body?: string,
  userId: number
}

export interface CommentItem {
  postId: number,
  id: number,
  name: string,
  email: string,
  body?: string,
}

export interface AlbumItem {
  userId: number,
  id: number,
  title: string
}

export interface PhotoItem {
  albumId: number,
  id: number,
  title: string,
  url: string,
  thumbnailUrl: string
}

export interface TodoItem {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

export interface UserItem {
  id: number,
  name: string,
  username: string,
  email: string,
  address: AddressItem,
  phone: string,
  website: string,
  company: CompanyDetailItem,
}

export interface AddressItem {
  street: string,
  suite: string,
  city: string,
  zipcode: string,
  geo: GeoPos
}

export interface GeoPos {
  lng: number,
  lat: number
}

export interface CompanyDetailItem {
  name: string,
  catchPhrase: string,
  bs: string
}