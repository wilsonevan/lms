import React from "react";
import styled from "styled-components";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Popup } from "semantic-ui-react";

class CourseItem extends React.Component {
    state = { deleting: false }



    handleDelete = (result) => {
        this.setState({ deleting: true })
        axios.delete(`/api/courses/${result.id}`)
        .then(res => {
            this.props.updateSearch();
        })
    }
    render() {
        const { result } = this.props;

        return(
            <ItemContainer>
                <Link to={`/admin/courses/${result.id}`} style={{width: "100%"}} >
                    <Item>
                        { result.title }
                    </Item>
                </Link>
    
                { !this.state.deleting
                ?   (
                        <Popup 
                            trigger={
                                <ButtonContainer onClick={() => this.handleDelete(result) } >
                                    <Close src={require("../../images/grey-close.svg")} alt=""/>
                                </ButtonContainer>
                            }
                            header={<div style={{textAlign: "center", marginBottom: "0.5rem", color: "#2979ff", textDecoration: "underline" }} >WARNING: this will delete the entire course</div> }
                        />
                    )
                :   (
                        <Popup 
                            trigger={
                                <ButtonContainer >
                                    <Close src={require("../../images/grey-close.svg")} alt=""/>
                                </ButtonContainer>
                            }
                            header={<div style={{textAlign: "center", marginBottom: "0.5rem", color: "red", textDecoration: "underline" }} >Course Is Being Deleted</div> }
                        />
                    )
                }
    
            </ItemContainer>
        )
    }
}

const Close = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  vertical-align: middle;
`

const ItemContainer = styled.div`
    position: relative;
    width: 100%;
`

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-decorattion: none;
    font-size: 1.25rem;
    letter-spacing: 2px;
    color: grey;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(100,100,100, 0.1);
    text-align: left;
    transition-duration: 0.1s;
    cursor: pointer;

    :hover {
        color: #23a24d;
        background-color: #f7f7f7;
    }
`
const ButtonContainer = styled.div`
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 1rem;
    border-radius: 100px;
    padding: 0.5rem;
    cursor: pointer;
`


export default CourseItem;