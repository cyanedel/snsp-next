'use client'

import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Button, Row, Col
  , Card, CardBody, CardTitle, CardText
  , InputGroup, FormGroup, FormLabel, FormControl, Modal
} from 'react-bootstrap';
import Link from "next/link";

import styleModule from "./page.module.css"
import { PostItem } from "@/component/interface";

export function ArticleEditForm({defaultFormData}: {defaultFormData: PostItem}):JSX.Element{
  const [defaultData, setDefaultData] = useState<PostItem>(defaultFormData)
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState<boolean>(false)
  const [showModalNoticeDelete, setShowModalNoticeDelete] = useState<boolean>(false)
  const [showModalConfirmUpdate, setShowModalConfirmUpdate] = useState<boolean>(false)
  const [showModalNoticeUpdate, setShowModalNoticeUpdate] = useState<boolean>(false)
  const [aTitle, setATitle] = useState<string>(defaultFormData.title)
  const [aBody, setABody] = useState<string>(defaultFormData.body || "")
  const [showReset, setShowReset] = useState<boolean>(false)

  useEffect(()=>{
    if(aTitle != defaultData.title || aBody != defaultData.body){
      setShowReset(true)
    }
  }, [aTitle, aBody])

  const onChangeTitle = (e: any) => {
    console.log(e.target.value)
    setATitle(e.target.value)
  }

  const onChangeBody = (e:any) => {
    console.log(e.target.value)
    setABody(e.target.value)
  }

  function resetForm():void{
    location.reload()
    // setATitle(defaultFormData.title)
    // setABody(defaultFormData.body || "")
    // setShowReset(false)
  }

  function removeArticle(){
    deleteArticle(defaultData.id)
      .then((res)=>{
        if(res){
          setShowModalConfirmDelete(false)
          setShowModalNoticeDelete(true)
        }
      }).catch(err=>{console.error(err)})
  }

  function modArticle(){
    updateArticle({
      title: aTitle,
      body: aBody,
      postId: defaultData.id
    }).then((res)=>{
      if(res.id){
        setDefaultData(res) //Ideally should be re-pull from api. not setting it like this.
        setShowModalConfirmUpdate(false)
        setShowModalNoticeUpdate(true)
        setShowReset(false)
      }
    }).catch((err:Error)=>{console.error(err)})
  }

  return (
    <>
    <ModalConfirmDelete
      show={showModalConfirmDelete}
      handleClose={()=>{setShowModalConfirmDelete(false)}}
      handleConfirm={()=>removeArticle()}
      title={defaultData.title}
    />
    <ModalNoticeRemoved
      show={showModalNoticeDelete}
      handleClose={()=>{setShowModalNoticeDelete(false)}}
      title={defaultData.title}
    />
    <ModalConfirmUpdate
      show={showModalConfirmUpdate}
      handleClose={()=>{setShowModalConfirmUpdate(false)}}
      handleConfirm={()=>modArticle()}
    />
    <ModalNoticeUpdated
      show={showModalNoticeUpdate}
      handleClose={()=>{setShowModalNoticeUpdate(false)}}
    />
    <FormGroup className="my-3">
      <FormLabel>Article Title</FormLabel>
      <FormControl defaultValue={aTitle} id="a-title" placeholder="Article title" onChange={debounce(onChangeTitle, 300)} />
    </FormGroup>
    <FormGroup className="my-3">
      <FormLabel>Article Content</FormLabel>
      <FormControl as="textarea" defaultValue={aBody} placeholder="Article content" className={`${styleModule.h300px}`} onChange={debounce(onChangeBody, 300)} />
    </FormGroup>
    <FormGroup className="mt-5 mb-3 text-center">
      {!showReset ? <Button variant='danger' onClick={()=>{setShowModalConfirmDelete(true)}}>Remove Article</Button> : <></>}
      {showReset ? <Button variant='warning' onClick={()=>{resetForm()}}>Reset Article</Button> : <></>}
      <Button variant='success' onClick={()=>{setShowModalConfirmUpdate(true)}} className='ms-2'>Update Article</Button>
    </FormGroup>
    </>
  )
}

function deleteArticle(postId:string|number):Promise<boolean|Error>{
  return new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`API request failed with status ${response.status}`);
        }
      })
      .then(data => resolve(true))
      .catch(error => reject(error));
  });
}

function updateArticle({title, body, postId}: {title:string, body:string, postId:number}):Promise<PostItem|Error>{
  return new Promise((resolve, reject) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: title, body: body}),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    })
    .then((data:PostItem) => {resolve(data)})
    .catch(error => reject(error));
  });
}

function ModalConfirmDelete({show, handleClose, handleConfirm, title}: {show:boolean, handleClose: ()=>void, handleConfirm: ()=>void, title:string}):JSX.Element{
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header><div className="text-center w-100 fw-bold fs-3">Remove Article Confirmation</div></Modal.Header>
      <Modal.Body>Remove article titled:<br />&ldquo;<b>{title}&rdquo;</b>?</Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={handleConfirm}>Yes, remove it</Button>
        <Button variant="warning" onClick={handleClose}>No, take me back</Button>
      </Modal.Footer>
    </Modal>
  )
}

function ModalConfirmUpdate({show, handleClose, handleConfirm}: {show:boolean, handleClose: ()=>void, handleConfirm: ()=>void}):JSX.Element{
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header><div className="text-center w-100 fw-bold fs-3">Update Article Confirmation</div></Modal.Header>
      <Modal.Body>Update article?</Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={handleConfirm}>Yes, please</Button>
        <Button variant="warning" onClick={handleClose}>No, let's go back</Button>
      </Modal.Footer>
    </Modal>
  )
}

function ModalNoticeRemoved({show, handleClose, title}: {show:boolean, handleClose: ()=>void, title:string}):JSX.Element{
  return(
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header><div className="text-center w-100 fw-bold fs-3">Article Removed</div></Modal.Header>
      <Modal.Body>
        Article titled:<br />
        &ldquo;<b>{title}&rdquo;</b><br />
        has been removed.<br /><br />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Link href={"/"}><Button variant="success" onClick={handleClose}>Ok, back to home</Button></Link>
      </Modal.Footer>
    </Modal>
  )
}

function ModalNoticeUpdated({show, handleClose}: {show:boolean, handleClose: ()=>void}):JSX.Element{
  return(
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header><div className="text-center w-100 fw-bold fs-3">Article Updated</div></Modal.Header>
      <Modal.Body>Article has been updated successfully.</Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="success" onClick={handleClose}>Done</Button>
        <Link href={"/"}><Button variant="success" onClick={handleClose}>Home</Button></Link>
      </Modal.Footer>
    </Modal>
  )
}