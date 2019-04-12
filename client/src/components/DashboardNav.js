import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  state = { selected: this.props.items[0] };

  setSelected = selected => {
    this.setState({ selected });
  };

  renderContent = () => {
    const selections = {
      edit: (
        <div className="section-container">
            EDITING
        </div>
      ),
      attendance: (
        <div className="section-container">
            ATTENDANCE
        </div>
      ),
      students: (
        <div className="section-container">
          STUDENTS
        </div>
      )
    };

    return selections[this.state.selected];
  };

  render() {
    const { selected } = this.state;
    return (
      <DashboardContainer>
          <DashboardNav
            selected={selected}
            setSelected={this.setSelected}
            items={this.props.items}
            rightItems={this.props.rightItems}
          />
          <SelectedContainer>
            { this.props[selected] }
          </SelectedContainer>
      </DashboardContainer>
    );
  }
}

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background-color: white;
    min-height: 25vh;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.1);
`;

const SelectedContainer = styled.div`
  padding: 1rem;
`



class DashboardNav extends React.Component {
    highlightIf = itemName => {
      if (this.props.selected !== itemName) return null;
      return { backgroundColor: "rgba(0,0,0,0.1)" };
    };
  
    handleClick = selected => {
      this.props.setSelected(selected);
    };

    renderNavItems = () => {
       return this.props.items.map((item, index) => {
           if( typeof item === "string")
            return ( 
                <NavItem
                    key={index}
                    style={this.highlightIf(item)}
                    onClick={() => this.handleClick(item)}    
                >
                    { item.charAt(0).toUpperCase() + item.slice(1, item.length) }
                </NavItem>
            )
            else return (
                <Link to={item.path} key={index} >
                    <NavItem
                    >
                    { item.name.charAt(0).toUpperCase() + item.slice(1, item.length) }
                    </NavItem>
                </Link>
            )
       })
    }

    renderRightNavItems = () => {
       return this.props.rightItems.map((item, index) => {
           if( typeof item === "string")
            return ( 
                <NavItem
                    key={index}
                    style={this.highlightIf(item)}
                    onClick={() => this.handleClick(item)}    
                >
                    { item.charAt(0).toUpperCase() + item.slice(1, item.length) }
                </NavItem>
            )
            else return (
                <Link to={item.path} key={index} >
                    <NavItem
                    >
                    { item.name.charAt(0).toUpperCase() + item.name.slice(1, item.name.length) }
                    </NavItem>
                </Link>
            )
       })
    }
  
    render() {
      return (
        <NavContainer>
          <div className="left-items">
            { this.renderNavItems() }
          </div>
          <div className="right-items">
            { this.renderRightNavItems() }
          </div>
        </NavContainer>
      );
    }
  }
  
  const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #23a24d;
    overflow: hidden;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  `;
  
  const NavItem = styled.button`
    heght: 100%;
    background-color: transparent;
    border: none;
    color: white;
    padding: 1rem 2rem;
    font-family: "Poppins";
    font-size: 1.3rem;
    letter-spacing: 2.5px;
    cursor: pointer;
    transition-duration: 0.1s;
    outline: none;
  
    :hover {
      background-color: #41c36c;
    }
  
    :active {
      color: #23a24d;
      background-color: white;
    }
  `;

export default Dashboard;