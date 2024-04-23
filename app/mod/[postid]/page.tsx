import Image from "next/image";
import Link from "next/link";

import { Container } from "react-bootstrap";
import { ArticleEditForm } from "./page.client";

import { PostItem } from "@/component/interface";

async function fetchPostDetails(postId: string):Promise<PostItem>{
  const dataRaw = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  const dataParsed: PostItem = await dataRaw.json()
  return dataParsed
}

export default async function Page({ params }: { params: { postid: string } }) {
  const resPost: PostItem = await fetchPostDetails(params.postid);
  return (
    <main>
      <Container className="my-5">
        <ArticleEditForm defaultFormData={resPost} />
        <hr />
        <p className="text-center"><Link href={"/"}>Back to Home</Link></p>
        <hr />
      </Container>
    </main>
  )
}