/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button, TextField } from "@mui/material";

function App() {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleOnChange = (e) => {
    setEditedTitle(e.target.value);
  };

  console.log(data, "data");

  function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.slice(0, maxLength) + "...";
  }

  const url = "https://jsonplaceholder.typicode.com/posts";
  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      const data = await response.data;
      setData(data);
      console.log(data, "data");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAlbumData = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setData(data.filter((album) => album.id !== id));
      console.log(`Album with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting album:", error);
    }
  };

  const editAlbumData = async (id, title) => {
    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          id: id,
          title: title,
        }
      );
      const updatedAlbum = await response.data;
      setData(data.map((album) => (album.id === id ? updatedAlbum : album)));
      setEditMode(null);
      setEditedTitle("");
      console.log(`Album with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <Box className="albums_container">
        {data?.map((album) => {
          return (
            <Card
              key={album.id}
              className="card"
              sx={{ boxShadow: "0px 6px 15px lightblue", borderRadius: "15px" }}
            >
              <CardContent className="box">
                <Typography gutterBottom variant="h4" component="div">
                  {album.id}
                </Typography>
                {editMode === album.id ? (
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    value={editedTitle}
                    onChange={(e) => handleOnChange(e)}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    className="ellipsis"
                  >
                    {truncateString(album.title, 10)}
                  </Typography>
                )}
                <img
                  src={"public/images.jpg"}
                  alt={album.title}
                  width={"200px"}
                  height={"100px"}
                  style={{
                    borderRadius: "15px",
                    padding: "10px 5px",
                  }}
                />
              </CardContent>
              <CardContent
                sx={{ gap: "50px", display: "flex", justifyContent: "center" }}
              >
                {editMode === album.id ? (
                  <Button
                    variant="contained"
                    onClick={() => editAlbumData(album.id, editedTitle)}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditedTitle(album.title);
                      setEditMode(album.id);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => deleteAlbumData(album.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </div>
  );
}

export default App;
