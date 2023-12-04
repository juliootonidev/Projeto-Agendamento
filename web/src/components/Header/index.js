const Header = () => {
    return (
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center">
                <div>
                    <span className="d-block m-0 p-0 text-white">Barbearia Tal</span>
                    <small className="m-0 p-0">Plano Gold</small>
                </div>
                <img src="https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Barbearia" />
                <span className="mdi mdi-chevron-down text-white"></span>
            </div>
        </header>
    )
}

export default Header;

