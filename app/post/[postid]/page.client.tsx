'use client'

import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Container, Button
  , Card, CardBody, CardText
  , FormGroup, FormLabel, FormControl, Modal
} from 'react-bootstrap';
import Image from "next/image";

import styleModule from "./page.module.css"
import { CommentItem } from "@/component/interface";

export function FormNewComment({postId}: {postId:number}):JSX.Element{
  const [showModalNotice, setShowModalNotice] = useState<boolean>(false)
  const [showModalError, setShowModalError] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  const [listComment, setListComment] = useState<CommentItem[]>()

  useEffect(()=>{
    setName("");
    setEmail("");
    setComment("");
    (document.getElementById("comm-name") as HTMLInputElement).value = "";
    (document.getElementById("comm-email") as HTMLInputElement).value = "";
    (document.getElementById("comm-body") as HTMLInputElement).value = "";
    setProcessing(false)
  }, [listComment])

  const onChangeName = (e:any) => { setName(e.target.value) }
  const onChangeEmail = (e:any) => { setEmail(e.target.value) }
  const onChangeBody = (e:any) => { setComment(e.target.value) }

  function addCommentToList(commentItem:CommentItem){
    setListComment(prev=> [...prev ?? [], commentItem])
  }

  function onSubmit(){
    if (name && email && comment){
      const newCommentItem = {
        postId: postId, id: 0,
        name: name, email: email, body: comment
      }
      CreateComment(newCommentItem).then(()=>{
        addCommentToList(newCommentItem);
      }).catch(err=>{
        console.log(err);
        setProcessing(false);
        setShowModalError(true);
        addCommentToList(newCommentItem);
      })
    } else {
      setShowModalNotice(true)
      setProcessing(false)
    }
  }

  return(
  <>
  {listComment ? (
    <Container>
    <RenderNewComment listComment={listComment}/>
  </Container>
  ) : <></>}
  <Container>
    <FormGroup className="my-3" controlId="comm-name">
      <FormLabel>Name</FormLabel>
      <FormControl defaultValue={name} placeholder="Type your name" onChange={debounce(onChangeName, 300)} />
    </FormGroup>
    <FormGroup className="my-3" controlId="comm-email">
      <FormLabel>Email</FormLabel>
      <FormControl type="email" defaultValue={email} placeholder="Type your e-mail" onChange={debounce(onChangeEmail, 300)} />
    </FormGroup>
    <FormGroup className="my-3" controlId="comm-body">
      <FormLabel>Comment</FormLabel>
      <FormControl as="textarea" defaultValue={comment} placeholder="Write something interesting" className={`${styleModule.htextarea}`} onChange={debounce(onChangeBody, 300)} />
    </FormGroup>
    <Button variant="success" onClick={()=>{setProcessing(true); onSubmit();}} disabled={processing}>Submit</Button>
    <ModalNotice
      show={showModalNotice}
      handleClose={()=>{setShowModalNotice(false)}}
      title="Incomplete Form"
      msg="Please fill all required fields!"
    />
    <ModalNotice
      show={showModalError}
      handleClose={()=>{setShowModalError(false)}}
      title="Error"
      msg="Error occured. But I'll still add to list anyway."
    />
  </Container>
  </>
  )
}

function CreateComment({postId, id, name, email, body}: CommentItem):Promise<object|Error>{
  return new Promise((resolve, reject) => {
    // Just realized this url actually does not exist. It supposed to be example for "create" but you should able to get the gist of it.
    fetch(`https://jsonplaceholder.typicode.com/comment/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({
        postId: postId
        , id: id
        , name: name
        , email: email
        , body: body
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    })
    .then((data:CommentItem) => {resolve(data)})
    .catch(error => reject(error));
  });
}

function RenderNewComment({listComment}: {listComment:CommentItem[]}):JSX.Element{
  return (<>
    {listComment && listComment.map((item, index)=>{
    return (
      <Card key={index} className="my-3">
        <CardBody>
          <div className="d-flex align-items-top flex-column flex-md-row">
            <Image src={`/${0}.jpg`} alt="" className="rounded-circle" width={80} height={80} />
            <div className="mt-3 mt-md-0 ms-md-3">
              <CardText >{item.body}</CardText>
              <hr />
              <small>{item.name} ({item.email})</small>
            </div>
          </div>
        </CardBody>
      </Card>
    )
    })}
  </>)
}

function ModalNotice({show, handleClose, title, msg}: {show:boolean, handleClose: ()=>void, title:string, msg:string}):JSX.Element{
  return(
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header><div className="text-center w-100 fw-bold fs-3">{title}</div></Modal.Header>
      <Modal.Body>{msg}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="success" onClick={handleClose}>Done</Button>
      </Modal.Footer>
    </Modal>
  )
}