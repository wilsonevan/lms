import React from "react";
import axios from "axios";
import anime from "animejs";
import styled from "styled-components";
import AdminUnit from "./AdminUnit";
import { ButtonBlue } from "../../styles/Components";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class AdminSection extends React.Component {
  state = {
    laoded: false,
    opened: false,
    units: []
  };

  unitContainerRef = React.createRef();
  sectionRef = React.createRef();

  componentDidMount = () => {
    axios
      .get(`/api/sections/${this.props.section.id}/units`)
      .then(res => {
        ///// Here we add quizzes and assignments just to have filler data
        ///// Delete this when those models actually exist
        const units = res.data.map(unit => {
          unit.quizzes = [""];
          unit.assignments = [""];
          return unit;
        });
        this.setState({ units, loaded: true });
      })
      .catch(err => console.log(err));
  };

  componentWillUnmount() {
    anime.remove(this.unitContainerRef.current, this.sectionRef.current);
  }

  handleClick = event => {
    if (!this.state.opened && this.state.loaded) {
      this.setState({ opened: !this.state.opened }, () => {
        anime({
          targets: this.unitContainerRef.current,
          height: `${this.state.units.length * 2.75}rem`,
          duration: `${this.state.units.length * 50}`,
          easing: "linear"
        });
        anime({
          targets: this.unitContainerRef.current,
          duration: `${this.state.units.length * 50}`,
          opacity: "1",
          easing: "linear"
        });
        anime({
          targets: this.sectionRef.current,
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
          duration: `${this.state.units.length * 50}`,
          easing: "linear"
        });
      });
    } else {
      anime({
        targets: this.sectionRef.current,
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        duration: `${this.state.units.length * 50}`,
        easing: "linear"
      });
      anime({
        targets: this.unitContainerRef.current,
        height: "0",
        opacity: "0",
        duration: `${this.state.units.length * 55}`,
        easing: "linear"
      }).finished.then(() => this.setState({ opened: !this.state.opened }));
    }
    // this.setState({ opened: !this.state.opened });
  };

  renderUnits = () => {
    return this.state.units.map((unit, index) => {
      return (
        <AdminUnit
          key={index}
          unit={unit}
          unitContainerRef={this.unitContainerRef}
        />
      );
    });
  };

  render() {
    const { title } = this.props;
    const { loaded, units } = this.state;

    if (this.state.opened) {
      return (
        <>
            <Section
              onClick={this.handleClick}
              ref={this.sectionRef}
              style={{marginBottom: "0"}}
            >
              <SectionTitle>
                {loaded && units.length === 0 && "(No Units)"} {title}
              </SectionTitle>
              <SectionIcon>
                <Link
                  to={`/admin/courses/${this.props.section.course_id}/sections/${
                    this.props.section.id
                  }`}
                >
                  <ButtonBlue style={buttonStyles}>Edit Section</ButtonBlue>
                </Link>
              </SectionIcon>
            </Section>
            <UnitsContainer
              ref={this.unitContainerRef}
              className="units-container"
            >
              {this.renderUnits()}
            </UnitsContainer>
        </>
      );
    } else {
      return (
        <>
            <Section ref={this.sectionRef} onClick={this.handleClick}>
              <SectionTitle>
                {loaded && units.length === 0 && "(No Units)"} {title}
              </SectionTitle>
              <SectionIcon>
                <Link
                  to={`/admin/courses/${this.props.section.course_id}/sections/${
                    this.props.section.id
                  }`}
                >
                  <ButtonBlue style={buttonStyles}>Edit Section</ButtonBlue>
                </Link>
              </SectionIcon>
            </Section>
        </>
      );
    }
  }
}

const Section = styled.div`
  position: relative;
  width: 90%;
  border-radius: 10px;
  padding: 1.1rem;
  margin: 0 auto 2rem auto;
  background-color: #23a24d;
  color: white;
  cursor: pointer;
  background-image: linear-gradient(
    to right,
    rgba(75, 255, 100, 0.2) 15%,
    #23a24d,
    rgba(75, 255, 100, 0.2) 85%
  );
`;

const SectionTitle = styled.div`
  letter-spacing: 3.5px;
  font-size: 1.3rem;
  width: 95%;
`;

const SectionIcon = styled.div`
  position: absolute;
  transform: translateY(-50%);
  right: 0.5rem;
  top: 50%;
  font-size: 1.5rem;
`;

const UnitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  margin: 0 auto 2rem auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
  height: 0;
  width: 90%;
  opacity: 0;
  box-shadow: 0 1px 1px 1px rgba(100,100,100,0.1);
`;

const buttonStyles = {
  padding: "0.8rem 1rem"
};

export default AdminSection;
