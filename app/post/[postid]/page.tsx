import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container, Card, CardBody, CardText } from "react-bootstrap";

import styleModule from "./page.module.css"
import { PostItem, UserItem, PhotoItem, CommentItem } from "@/component/interface";

export async function generateMetadata( { params }: { params: { postid: string } }, parent: ResolvingMetadata ): Promise<Metadata> {
  const id = params.postid
  const resPost: PostItem = await fetchPostDetails(id);
  return {
    title: resPost.title,
    description: resPost.body,
    openGraph: {
      title: resPost.title,
      description: resPost.body,
      images: ["/1.jpg"]
    }
  }
}

async function fetchPostImage(imageId: string):Promise<PhotoItem>{
  const dataRaw = await fetch(`https://jsonplaceholder.typicode.com/photos/${imageId}`)
  const dataParsed: PhotoItem = await dataRaw.json()
  return dataParsed
}

async function fetchPostDetails(postId: string):Promise<PostItem>{
  const dataRaw = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  const dataParsed: PostItem = await dataRaw.json()
  return dataParsed
}

async function fetchUserDetails(userId: string):Promise<UserItem>{
  const dataRaw = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  const dataParsed: UserItem = await dataRaw.json()
  return dataParsed
}

async function fetchPostComment(postId: string):Promise<CommentItem[]>{
  const dataRaw = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
  const dataParsed: CommentItem[] = await dataRaw.json()
  return dataParsed
}

export default async function ArticleView({ params }: { params: { postid: string } }) {
  const resPost: PostItem = await fetchPostDetails(params.postid);
  const resPostImage: PhotoItem = await fetchPostImage(params.postid);
  const resWriter: UserItem = await fetchUserDetails(""+resPost.userId);
  const resPostComment: CommentItem[] = await fetchPostComment(params.postid);
  return (
    <main className="bg-light pt-0 py-sm-5">
    <Container className={`${styleModule.postcontainer} rounded`}>
      <Image src={resPostImage.url} alt="" fill={true} className={`${styleModule.postimage}`}/>
    </Container>
    <Container className="my-3">
      <h1 className="text-capitalize">{resPost.title}</h1>
      <p>{resPost.body}. {resPost.body}.</p>
      <p>{resPost.title}.</p>
      <p>{resPost.body}. {resPost.title}. {resPost.body}.</p>
      <p>{resPost.title}. {resPost.body}.</p>
      <p>{resPost.body}.</p>
      <hr />
      <small>
        Writer: {resWriter.name} ({resWriter.email})<br />
        <Link href={`/mod/${params.postid}`}>Modify Article</Link> | <Link href={"/"}>Back to Home</Link>
      </small>
      <hr />
    </Container>
    <Container>
      <h3>Comments:</h3>
      {resPostComment.map((item, index)=>{
        const avatarId: string|number = item.id > 10 ? (""+item.id).slice(-1) : item.id
        return (
          <Card key={index} className="my-3">
            <CardBody>
              <div className="d-flex align-items-top flex-column flex-md-row">
                <Image src={`/${avatarId}.jpg`} alt="" className="rounded-circle" width={80} height={80} />
                <div className="mt-3 mt-md-0 ms-md-3">
                  <CardText >{item.body}. {item.body}. {item.body}.</CardText>
                  <hr />
                  <small>{item.name} ({item.email})</small>
                </div>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </Container>
    </main>
  )
}