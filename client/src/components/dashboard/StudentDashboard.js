import React from 'react'
import { Menu, Segment, Header } from 'semantic-ui-react'
import axios from 'axios'
import { Link, } from 'react-router-dom'
import styled from 'styled-components'
import Calendar from '../attendance/Calendar'
import DashboardNav from "../DashboardNav"


class StudentDashboard extends React.Component {
  state = { userCourses: [],}

  componentDidMount(){
    axios.get(`/api/user_courses`)
    .then(res => {
      this.setState({ userCourses: res.data });
    })
  }

  renderUserMenu = () => {
    const { auth: {user}, } = this.props

    return(
      <Segment basic>
          <Header as='h1'>
            Welcome {user.first_name}
          </Header>
          <DashboardNav 
            items={['courses', 'calendar', 'todo', 'grades',]}
            rightItems={[{ name: 'profile', path: "/profile"},]}
            courses={
              this.state.userCourses.map( course => {
                return (
                  <Link to={`/courses/${course.id}`} key={course.id}>
                    <CourseOptions>
                      <h3>{course.title}</h3>
                    </CourseOptions>
                  </Link>
                )
              })
            }
            calendar={<Calendar />}
            todo={<p>We still have to add todos, they are todo</p>}
            grades={<p>We still have to add grades</p>}
          />
      </Segment>
    )

}


render() {
  
  return (
      <>
        {this.renderUserMenu() }
      </>
    )
  }
}

const CourseOptions = styled.div`
  color: #23a24d

  :hover {
    color: #41c36c
  }
  
`

export default StudentDashboard