'use client'

import { Button, Row, Col
  , Card, CardBody, CardTitle, CardText
  , InputGroup, FormGroup, FormLabel, FormControl
} from 'react-bootstrap';

import styleModule from "./page.module.css"
import { PostItem } from "@/component/interface";

export function ArticleEditForm(props: {defaultFormData: PostItem}):JSX.Element{
  return (
    <>
    <FormGroup className="my-3">
      <FormLabel>Article Title</FormLabel>
      <FormControl defaultValue={props.defaultFormData.title} placeholder="Article title" />
    </FormGroup>
    <FormGroup className="my-3">
      <FormLabel>Article Content</FormLabel>
      <FormControl as="textarea" defaultValue={props.defaultFormData.body} placeholder="Article content" className={`${styleModule.h300px}`} />
    </FormGroup>
    <FormGroup className="mt-5 mb-3 text-center">
      <Button variant='danger'>Remove Article</Button>
      <Button variant='success' className='ms-2'>Update Article</Button>
    </FormGroup>
    </>
  )
}