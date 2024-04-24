'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { Row, Col
  , Card, CardBody, CardTitle, CardText
  , InputGroup, FormControl
} from 'react-bootstrap';
import { filter, includes, debounce } from "lodash";
import { PostItem } from "@/component/interface";

export function SectionContent({pageData}: {pageData: PostItem[]}):JSX.Element{
  const [filterString, setFilterString] = useState<string>("")
  const [listPost, setListPost] = useState<PostItem[]>(pageData)

  const onFilterChange = (e: any) => {
    setFilterString(e.target.value)
  }

  useEffect(()=>{
    let newList: PostItem[] = [];
    if(filterString){
      newList = filter(pageData, (item) => includes(item.title, filterString))
    } else {
      newList = pageData
    }
    setListPost(newList);
  }, [filterString])

  return (
    <>
    <InputGroup className="my-3">
      <InputGroup.Text>Filter</InputGroup.Text>
      <FormControl defaultValue={filterString} placeholder="Type to filter posts by title" onChange={debounce(onFilterChange, 300)}/>
    </InputGroup>
    <SectionPosts pageData={listPost}/>
    </>
  )
}

function SectionPosts(props: {pageData?: PostItem[]}):JSX.Element{
  return (
  <>
  <Row className="row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
  {props.pageData?.map((item, index)=>{
    return <Col key={index}>
      <Link href={`post/${item.id}`}>
        <Card className="h-100 flex-fill">
          <CardBody>
            <CardTitle className="text-capitalize">{item.title}</CardTitle>
            <CardText>{item.body}</CardText>
          </CardBody>
        </Card>
      </Link>
      </Col>
  })}
  </Row>
  </>
  )
}