import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import logo from '../../Images/eth-logo.png';


export class Navigation extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (<div>
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top" fixed="top">
                <Container>
                    <Navbar.Brand>
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="Ethereum Logo" height="60" width="100" />
                            Inicio
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar-nav" />
                    <Navbar.Collapse id="main-navbar-nav" >
                        <Nav className="me-auto">
                            <NavDropdown title="Contrato" id="contract-nav-dropdown">
                                <Link className="nav-link-drop dropdown-item" to="/contract/info">Información del contrato</Link>
                                <Link className="nav-link-drop dropdown-item" to="/contract/users">Lista de usuarios</Link>
                                <Link className="nav-link-drop dropdown-item" to="/contract/calculate">Reparto de pensiones</Link>
                            </NavDropdown>
                            <NavDropdown title="Usuario" id="user-nav-dropdown">
                                <Link className="nav-link-drop dropdown-item" to="/user/create">Crear usuario</Link>
                                <Link className="nav-link-drop dropdown-item" to="/user/fund">Contribuir a la pension</Link>
                                <Link className="nav-link-drop dropdown-item" to="/user/profile">Perfil usuario</Link>
                                <Link className="nav-link-drop dropdown-item" to="/user/edit">Modificar usuario</Link>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >);
    }
}