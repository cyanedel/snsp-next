'use client'

import { useState, useEffect, Fragment } from "react";
// import { debounce } from "lodash";
import { Button, Row, Col
  , Card, CardBody, CardTitle, CardText
  , InputGroup, FormGroup, FormLabel, FormControl, Modal
} from 'react-bootstrap';
import Link from "next/link";

import styleModule from "./page.module.css"
// import { PostItem } from "@/component/interface";

export function FormNewComment():JSX.Element{
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [comment, setComment] = useState<string>("")

  return(
  <>
  <FormGroup className="my-3">
    <FormLabel>Name</FormLabel>
    <FormControl defaultValue={name} placeholder="Type your name" />
  </FormGroup>
  <FormGroup className="my-3">
    <FormLabel>Email</FormLabel>
    <FormControl type="email" defaultValue={email} placeholder="Type your e-mail" />
  </FormGroup>
  <FormGroup className="my-3">
    <FormLabel>Comment</FormLabel>
    <FormControl as="textarea" defaultValue={comment} placeholder="Write something interesting" className={`${styleModule.htextarea}`} />
  </FormGroup>
  <Button variant="success">Submit</Button>
  </>
  )
}