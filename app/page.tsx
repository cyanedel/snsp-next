import Image from "next/image";
import styles from "./page.module.css";
import { Container } from 'react-bootstrap';
import { PostItem, PhotoItem } from "@/component/interface";
import { SectionContent } from "./page.client";

async function fetchPageData():Promise<PostItem[]>{
  const fetchdata = await fetch('https://jsonplaceholder.typicode.com/posts', {next: { revalidate: 10 }})
  const dataParsed: PostItem[] = await fetchdata.json()
  return dataParsed
}

async function fetchPageCover(selectedIndex: number):Promise<PhotoItem>{
  const fetchdata = await fetch(`https://jsonplaceholder.typicode.com/photos/${selectedIndex}`, {next: { revalidate: 60 }})
  const dataParsed: PhotoItem = await fetchdata.json()
  return dataParsed
}

export default async function Home() {
  const pageData:PostItem[] = await fetchPageData();
  const pageCover:PhotoItem = await fetchPageCover(7);
  const pageCover2:PhotoItem = await fetchPageCover(5);
  return (
    <main className="bg-light">
      <div className={`${styles["cover-container"]}`}>
        <Image src={pageCover.url} alt="" fill={true} className={`${styles["cover-img"]}`} />
      </div>
      <Container className='my-5'>
        <h2 className="my-3 text-capitalize">Stipes in hoc spatio enumerantur</h2>
        <SectionContent pageData={pageData}/>
      </Container>
      <div className={`${styles["cover-container"]}`}>
        <Image src={pageCover2.url} alt="" fill={true} className={`${styles["cover-img"]}`} />
      </div>
    </main>
  );
}
