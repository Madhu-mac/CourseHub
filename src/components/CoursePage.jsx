import { Box, Button, Card, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "@mui/material/Skeleton";
import "./courseStyle.css";

function Courses() {
  const [course, setCourse] = useState({});
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const courseResponse = await axios.get(
          `http://localhost:3000/users/courses/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setCourse(courseResponse.data.course);

        const purchasedCoursesResponse = await axios.get(
          "http://localhost:3000/users/purchasedCourses",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setPurchasedCourses(purchasedCoursesResponse.data.purchasedCourses);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const isCoursePurchased = purchasedCourses.some((item) => item._id === id);
    setIsPurchased(isCoursePurchased);
  }, [id, purchasedCourses]);

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `http://localhost:3000/users/courses/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success(response.data.message);

      setPurchasedCourses([...purchasedCourses, response.data.purchasedCourse]);
      setIsPurchased(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      </div>
    );
  }

  return (
    <div className="single-course">
      <div className="text-container">
        <div>
          <img
            src={course?.imageLink}
            alt={course?.imageLink}
            width={"200px"}
            style={{ borderRadius: "20px" }}
          />
        </div>
        <div>
          <h1 className="course-title">{course?.title}</h1>
        </div>
        <br></br>
        <div>
          <h3 className="course-des">{course?.description}</h3>
        </div>

        <div>
          {!isPurchased ? (
            <Button
              style={{
                backgroundColor: "#bc1c44",
                padding: "10px 10px",
                borderRadius: "15%",
                fontWeight: "700",
                fontSize: "20px",
              }}
              onClick={handleBuyNow}
            >
              BUY NOW @${course?.price}
            </Button>
          ) : (
            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "green",
                  padding: "10px 20px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  borderRadius: "50px",
                }}
              >
                Purchased
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#101460",
                  padding: "10px 20px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  borderRadius: "50px",
                  marginLeft: "20px",
                }}
              >
                View Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;
