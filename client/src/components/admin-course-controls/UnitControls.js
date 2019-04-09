import React from "react";
import axios from "axios";
import styled from "styled-components";
import { ButtonGreen, ButtonBlue } from "../../styles/Components";
import SearchBar from "../SearchBar";
import AddContentLink from "./AddContentLink";
import ContentBlock from "./ContentBlock";
import EditUnitTitle from "./EditUnitTitle";
import anime from "animejs";

class UnitControls extends React.Component {
  state = { editing: false, unit: this.props.unit, contents: [] };

  formRef = React.createRef();

  componentDidMount() {
    axios
      .get(`/api/units/${this.props.unit.id}/contents`)
      .then(res => {
        this.setState({ contents: res.data });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    anime.remove(this.formRef.current);
  }

  createUnitContent = content_id => {
    axios
      .post(`/api/unit_contents`, { content_id, unit_id: this.props.unit.id })
      .then(res => {
        return axios.get(`/api/units/${this.props.unit.id}/contents`);
      })
      .then(res => {
        this.setState({ contents: res.data });
      })
      .catch(err => console.log(err));
  };

  deleteUnitContent = content_id => {
    const unit_id = this.props.unit.id;
    axios
      .delete(`/api/unit/${unit_id}/contents/${content_id}/unit_content`)
      .then(res => {
        console.log(res.data);
        const contents = this.state.contents.filter(content => {
          if (content.id !== content_id) return this.renderUnitContents;
        });
        this.setState({ contents });
      })
      .catch(err => console.log(err));
  };

  AddContentLinkWithProps = () => {
    return <AddContentLink createUnitContent={this.createUnitContent} />;
  };

  toggleEditing = () => {
    if (!this.state.editing) {
      this.setState({ editing: true }, () => {
        anime
          .timeline({
            targets: this.formRef.current
          })
          .add({
            height: "33rem",
            easing: "linear",
            duration: 100
          })
          .add({
            opacity: 1,
            duration: 100
          });
      });
    } else {
      anime
        .timeline({
          targets: this.formRef.current
        })
        .add({
          height: "1.75rem",
          easing: "linear",
          duration: 200
        })
        .add({
          opacity: 0,
          duration: 375
        })
        .finished.then(() => this.setState({ editing: false }));
    }
  };

  renderUnitContents = () => {
    return this.state.contents.map((content, index) => {
      return (
        <ContentBlock
          key={content.id}
          content={content}
          unit={this.props.unit}
          index={index}
          deleteUnitContent={this.deleteUnitContent}
        />
      );
    });
  };

  render() {
    const { unit, updateUnit, deleteUnit } = this.props;
    if (!this.state.editing)
      return (
        <UnitText onClick={() => this.toggleEditing()}>{unit.title}</UnitText>
      );
    else
      return (
        <UnitForm onSubmit={this.handleSubmit} ref={this.formRef}>
          <FormTop>
            <div>
              <ButtonGreen
                as="a"
                href="/content/new"
                target="_blank"
                style={{ padding: "0.325rem 0.75rem" }}
              >
                Create New
              </ButtonGreen>
              <ButtonBlue
                style={{
                  padding: "0.5rem 0.75rem",
                  marginLeft: "0.5rem"
                }}
              >
                Contents
              </ButtonBlue>
              <ButtonBlue
                style={{
                  padding: "0.5rem 0.75rem",
                  marginLeft: "0.5rem"
                }}
              >
                Assignments
              </ButtonBlue>
              <ButtonBlue
                style={{
                  padding: "0.5rem 0.75rem",
                  marginLeft: "0.5rem"
                }}
              >
                Quizzes
              </ButtonBlue>
            </div>

            <div>
              <ButtonGreen
                onClick={() => this.toggleEditing()}
                style={{
                  padding: "0.5rem 0.75rem",
                  marginLeft: "0.5rem"
                }}
              >
                Finished
              </ButtonGreen>
              <ButtonBlue
                style={{
                  padding: "0.5rem 0.75rem",
                  marginLeft: "0.5rem"
                }}
                onClick={() => deleteUnit(unit.id)}
              >
                Delete
              </ButtonBlue>
            </div>
          </FormTop>
          <FormBottom>
            <FormBottomLeft>
              <SearchBar
                route={`/api/contents/search/${this.props.unit.id}`}
                render={props => (
                  <AddContentLink
                    {...props}
                    createUnitContent={this.createUnitContent}
                    unit={unit}
                  />
                )}
                placeholder="Search Contents To Add ..."
                width="100%"
              />
            </FormBottomLeft>
            <FormBottomRight>
              <ContentHeading>
                <EditUnitTitle
                  unit={unit}
                  section={this.props.section}
                  updateUnit={updateUnit}
                />
              </ContentHeading>
              {this.renderUnitContents()}
            </FormBottomRight>
          </FormBottom>
        </UnitForm>
      );
  }
}

const UnitText = styled.p`
  color: grey;
  letter-spacing: 2px;
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(100, 100, 100, 0.1);
  width: 90%;
  margin: 0 auto;
  padding-top: 2rem;
  cursor: pointer;
  // transition-duration: 0.1s;

  :hover {
    color: #0029ff;
  }
`;

const ContentHeading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  color: white;
  background-color: #bdbdbd;
  padding-top: 0.5rem;
  text-align: center;
`;

const UnitForm = styled.div`
  height: 2rem;
  opacity: 0;
  width: 90%;
  margin: 2rem auto 0 auto;
  border: 1px solid #bdbdbd;
  border-top: none;
  border-radius: 5px;
  overflow: hidden;
  transition-duration: 0.5s;
`;

const FormTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  width: 100%;
  min-height: 3rem;
  background-color: #bdbdbd;
  color: white;
`;

const FormBottom = styled.div`
  display: flex;
  justify-contents: center;
  align-items: flex-start;
`;

const FormBottomLeft = styled.div`
  height: 30rem;
  width: 50%;
  border-right: 1px solid #bdbdbd;
  background-color: #bdbdbd;
`;
const FormBottomRight = styled.div`
  position: relative;
  height: 30rem;
  overflow-y: scroll;
  width: 50%;
  padding: 3rem 0.5rem 0 0.5rem;
`;

export default UnitControls;