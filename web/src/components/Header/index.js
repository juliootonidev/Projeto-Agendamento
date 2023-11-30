const Header = () => {
    return (
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center">
                <div>
                    <span>Barbearia Tal</span>
                    <small>Plano Gold</small>
                </div>
                <img src="teste.jpg" alt="Barbearia" />
                <span className="mdi mdi-chevron-down"></span>
            </div>
        </header>
    )
}

export default Header;
