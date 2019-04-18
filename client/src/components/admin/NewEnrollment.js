import React from "react";
import axios from "axios";
import styled from "styled-components";
import Select from "react-select";
import SearchBar from "../SearchBar";
import LeftEnrollmentUser from "./LeftEnrollmentUser";
import RightEnrollmentUser from "./RightEnrollmentUser";

class NewEnrollment extends React.Component {
  state = { users: [], selectedCourseId: null, courses: [], teacher: false, searchUpdate: false};

  componentDidMount() {
    axios
      .get("/api/courses")
      .then(res => {
        this.setState({ courses: res.data });
      })
      .catch(res => console.log(res));
    
    document.querySelector(".Select").style.zIndex = "100";

  }

  setTeacherTrue = () => {
    this.setState({ teacher: true });
  }

  setTeacherFalse = () => {
    this.setState({ teacher: false });
  }

  updateSearch = () => {
    this.setState({ searchUpdate: !this.state.searchUpdate });
  }

  mapOptions = () => {
    return this.state.courses.map(course => ({
      value: course.id,
      label: course.title
    }));
  };

  handleChange = event => {
    this.setState({ selectedCourseId: event.value }, () => {
    });
  };

  createEnrollment = (user_id, course_id) => {
    const { teacher } = this.state;
    if(teacher) {
      axios.post(`/api/enrollments`, { user_id, course_id, role: "staff" })
      .then((res) => {
        this.updateSearch();
      })
      .catch((err) => console.log(err));
    } else {
      axios.post(`/api/enrollments`, { user_id, course_id, role: "student" })
      .then((res) => {
        this.updateSearch();
      })
      .catch((err) => console.log(err));
    }
  }

  deleteEnrollment = (user_id, course_id) => {
    axios.delete(`/api/users/${user_id}/courses/${course_id}/enrollments`)
    .then((res) => {
      this.updateSearch();
    })
    .catch((err) => console.log(err));
  }

  renderSearch = () => {
    const { teacher, selectedCourseId, searchUpdate} = this.state;
    if(teacher)
      return (
        <SearchBar
          render={props => (
            <RightEnrollmentUser 
              {...props} 
              deleteEnrollment={this.deleteEnrollment} 
              selectedCourseId={selectedCourseId} 
            />
          )}
          route={`/api/search_staff_enrolled/${selectedCourseId}`}
          height="40rem"
          width="100%"
          placeholder="Search Teachers Enrolled ..."
          updateFromParent={searchUpdate}
        />
      )
    else 
      return (
        <SearchBar
          render={props => (
            <RightEnrollmentUser 
              {...props} 
              deleteEnrollment={this.deleteEnrollment} 
              selectedCourseId={selectedCourseId} 
            />
          )}
          route={`/api/search_students_enrolled/${selectedCourseId}`}
          height="40rem"
          width="100%"
          placeholder="Search Students Enrolled ..."
          updateFromParent={searchUpdate}
        />
    )
  }

  render() {
    const { selectedCourseId, teacher, searchUpdate } = this.state;
    return (
      <>
        <CourseContainer>
          <CourseHeading>Select Course</CourseHeading>
          <SelectContainer>
            <Select
              name="selectedCourseId"
              onChange={this.handleChange}
              options={this.mapOptions()}
              placeholder="Search Courses..."
            />
          </SelectContainer>
        </CourseContainer>

        {selectedCourseId && (
          <SearchContainer>
            <LeftContainer>
              <SearchHeading>
                <SearchHeadingText>All Users</SearchHeadingText>
              </SearchHeading>
              <SearchBar
                render={props => (
                  <LeftEnrollmentUser 
                    {...props} 
                    createEnrollment={this.createEnrollment} 
                    selectedCourseId={selectedCourseId} 
                  />
                )}
                route={`/api/search_users_with_role/${selectedCourseId}`}
                height="40rem"
                width="100%"
                placeholder="Search Users To Add ..."
                updateFromParent={searchUpdate}
              />

            </LeftContainer>

            <RightContainer>
              <SearchHeading>
                <SearchHeadingText>Enrolled Users</SearchHeadingText>
                <div>
                  <TeacherButton onClick={() => this.setTeacherTrue()} style={teacher? {backgroundColor: "white", color: "#2979ff"} : null} > Teachers </TeacherButton>
                  <TeacherButton onClick={() => this.setTeacherFalse()} style={!teacher? {backgroundColor: "white", color: "#2979ff"} : null} > Students </TeacherButton>
                </div>
              </SearchHeading>
              { this.renderSearch() }
            </RightContainer>
          </SearchContainer>
        )}
      </>
    );
  }
}

const CourseContainer = styled.div`
  margin: 3rem auto;
  width: 50%;
`;

const SelectContainer = styled.div`
  position: absolute;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  z-index: 1;
  // margin: auto;
  // padding: 0px;
`

const CourseHeading = styled.h2`
  color: #23a24d;
  text-align: center;
  font-family: "Poppins";
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-around;  
  align-items: center;
  width: 100%;
  margin-top: 4rem; 
`
const SearchHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem; 
  height: 4rem
`
const SearchHeadingText = styled.h2`
  margin: 0;
  color: white;
  font-family: "Poppins";
  letter-spacing: 2px;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 47.5%;
  padding: 0.75rem;
  background-color: #23a24d;
  border-radius: 10px;
`
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 47.5%;
  padding: 0.75rem;
  background-color: #23a24d;
  border-radius: 10px;
`


const TeacherButton = styled.button`
  background-color: #2979ff;
  border: none;
  border-radius: 5px;
  color: white;
  font-family: "Poppins";
  padding: 0.25rem 0.5rem;
  margin-left: 1rem;
  cursor: pointer;

  :hover { background-color: #1577ff }
`

export default NewEnrollment;
