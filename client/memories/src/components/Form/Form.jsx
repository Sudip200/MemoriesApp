import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  FormHelperText
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
// import Carousel from "react-simply-carousel";
import css from "./Form.module.css";
import { createPost, updatePost } from "../../actions/posts";
import { Carousel } from "react-carousel-minimal";

const Form = ({ currentId, setCurrentId }) => {
  const [cdata,setCdata]=useState([])
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    tags: "",
    multipleImage:[],
    selectedFiles: {
      name: "",
      content: ""
    },
    touchedCreator: false,
    touchedTitle: false,
    touchedMessage: false,
    touchedTags: false,
    touchedFile: false
  });

  useEffect(()=>{
    if(postData.multipleImage.length >0){
  CarouselImg();
    }
   
  },[postData])

  const post = useSelector((state) =>
    currentId ? state.posts.find((message) => message._id === currentId) : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) 
    {setPostData(post)};
    if (postData.multipleImage){
    CarouselImg();
    }
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      creator: "",
      title: "",
      message: "",
      tags: "",
      selectedFiles: {
        name: "",
        content: ""
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (postData.creator !== "" ||
        postData.creator.match(/^[0-9]+$/) == null ||
        postData.creator.length < 30) &&
      (postData.message !== "" ||
        postData.message.match(/^[0-9]+$/) == null ||
        postData.message.length < 200) &&
      postData.selectedFiles.name.match(
        /\.(jpg|jpeg|png|gif|mov|mp4|webm|m4v)$/
      ) &&
      postData.tags !== "" &&
      (postData.title !== "" ||
        postData.title.match(/^[0-9]+$/) == null ||
        postData.title.length < 70)
    ) {
      if (currentId === 0) {
        dispatch(createPost(postData));
        clear();
      } else {
        dispatch(updatePost(currentId, postData));
        clear();
      }
    } else {
      setPostData({
        ...postData,
        touchedCreator: true,
        touchedTitle: true,
        touchedMessage: true,
        touchedTags: true,
        touchedFile: true
      });
    }
  };

  const captionStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
  }
  const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  }

   const CarouselImg=()=>{
    const ddata=[]
    for (let i=0;i< postData.multipleImage.length;i++ ) {
      
        ddata.push({ image: postData.multipleImage[i].base64,caption: postData.title })
     
    }
    setCdata(ddata);
   

   }


  return (
    <Paper className={css.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${css.root} ${css.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" className={css.head}>
          {currentId ? `Editing "${post.title}"` : "Creating a Memory"}
        </Typography>

        <div className={css.fileInput}></div>

        <TextField
          className={css.other}
          name="creator"
          variant="outlined"
          label="Creator"
          fullWidth
          value={postData.creator}
          error={
            (postData.touchedCreator && postData.creator === "") ||
            postData.creator.match(/^[0-9]+$/) != null ||
            postData.creator.length > 30
          }
          helperText={
            postData.touchedCreator && postData.creator === ""
              ? "Enter a creator!"
              : postData.creator.match(/^[0-9]+$/) != null
              ? "Only Numbers are not accepted"
              : postData.creator.length > 30
              ? "Creator name should be less than 30 characters"
              : " "
          }
          required
          onChange={(e) =>
            setPostData({
              ...postData,
              creator: e.target.value,
              touchedCreator: true,
            })
          }
        />
        <TextField
          className={css.other}
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          error={
            (postData.touchedTitle && postData.title === "") ||
            postData.title.match(/^[0-9]+$/) != null ||
            postData.title.length > 50
          }
          helperText={
            postData.touchedTitle && postData.title === ""
              ? "Enter a title!"
              : postData.title.match(/^[0-9]+$/) != null
              ? "Only Numbers are not accepted"
              : postData.title.length > 50
              ? "Title should be less than 50 characters"
              : " "
          }
          required
          onChange={(e) =>
            setPostData({
              ...postData,
              title: e.target.value,
              touchedTitle: true,
            })
          }
        />
        <TextField
          className={css.other}
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          error={
            (postData.touchedMessage && postData.message === "") ||
            postData.message.match(/^[0-9]+$/) != null ||
            postData.message.length > 200
          }
          helperText={
            postData.touchedMessage && postData.message === ""
              ? "Enter a message!"
              : postData.message.match(/^[0-9]+$/) != null
              ? "Only Numbers are not accepted"
              : postData.message.length > 200
              ? "Message should be less than 200 characters"
              : " "
          }
          required
          onChange={(e) =>
            setPostData({
              ...postData,
              message: e.target.value,
              touchedMessage: true,
            })
          }
        />
        <TextField
          className={css.other}
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags}
          error={postData.touchedTags && postData.tags === ""}
          helperText={
            postData.touchedTags && postData.tags === ""
              ? "Enter some tags!"
              : " "
          }
          required
          onChange={(e) =>
            setPostData({
              ...postData,
              tags: e.target.value,
              touchedTags: true,
            })
          }
        />
        <div className={css.fileInput}>
          <FileBase
            type="file"
            // multiple={true}
            // onDone={(base64) => {
            //   setPostData({ ...postData, selectedFiles: base64 });

            multiple={false}
            required
            onDone={(uploadedFile) => {
              console.log(uploadedFile);
              setPostData({
                ...postData,
                selectedFiles: {
                  name: uploadedFile.name,
                  content: uploadedFile.base64,
                },
                touchedFile: true,
              });
            }}
          />
          <FormHelperText
            error={
              postData.touchedFile &&
              !postData.selectedFiles.name.match(
                /\.(jpg|jpeg|png|gif|mov|mp4|webm|m4v)$/
              )
            }
          >
            {postData.touchedFile &&
            (postData.selectedFiles.content === "" ||
              !postData.selectedFiles.name.match(
                /\.(jpg|jpeg|png|gif|mov|mp4|webm|m4v)$/
              ))
              ? "Enter a valid file!"
              : " "}
          </FormHelperText>
        </div>

        <div className={css.fileInput}>
          <FileBase
            type="file"
            multiple={true}
            onDone={(base64) => {
              setPostData({ ...postData, multipleImage: base64 });
            }
          }
          />
        </div>

        {cdata.length > 0 ? (
          <Carousel
            data={cdata}
            time={2000}
            width="850px"
            height="500px"
            captionStyle={captionStyle}
            radius="10px"
            slideNumber={true}
            slideNumberStyle={slideNumberStyle}
            captionPosition="bottom"
            automatic={true}
            dots={true}
            pauseIconColor="white"
            pauseIconSize="40px"
            slideBackgroundColor="darkgrey"
            slideImageFit="cover"
            thumbnails={false}
            thumbnailWidth="100px"
            style={{
              textAlign: "center",
              maxWidth: "850px",
              maxHeight: "500px",
              margin: "40px auto",
            }}
          />
        ) : (
          <></>
        )}

        <Button
          className={css.buttonSubmit}
          variant="contained"
          color="primary"
          size="small"
          type="submit"
        >
          Submit
        </Button>
        <Button
          className={css.buttonClear}
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          //fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
