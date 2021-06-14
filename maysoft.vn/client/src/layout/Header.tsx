import React from 'react'
export default class Header extends React.Component {
    render() {
        return (
            <header className='header-container'>
                <nav className=''>
                    <div className='nav-container'>
                        <a aria-current='page' href='/home' rel='noopener'>
                            <img src='https://maydental.vn/assets/img/Logo_Maysoft_white.png'
                                width='80' height='auto'
                                alt='Maysoft home page'
                            />
                        </a>
                        <ul className=''>
                            <li className=''>
                                <button type='button'
                                    data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
                                >
                                    Product
                                    <svg width='8' height='8' fill='none' viewBox='0 0 6 4'>
                                        <path d='M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z'>
                                        </path>
                                    </svg>
                                </button>
                                <div className='dropdown-menu'>
                                    <a className='dropdown-item' href='#'>Action</a>
                                    <a className='dropdown-item' href='#'>Another action</a>
                                    <a className='dropdown-item' href='#'>Something else here</a>
                                </div>
                            </li>
                            <li className=''>
                                <button type='button'
                                    data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
                                >
                                    Explore
                                    <svg  width='8' height='8' fill='none' viewBox='0 0 6 4'>
                                        <path d='M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z'>
                                        </path>
                                    </svg>
                                </button>
                                <div className='dropdown-menu'>
                                    <a className='dropdown-item' href='#'>EEE</a>
                                    <a className='dropdown-item' href='#'>Another action</a>
                                    <a className='dropdown-item' href='#'>Something else here</a>
                                </div>
                            </li>
                            <li className=''>
                                <button type='button'
                                    data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
                                >
                                    Resources
                                    <svg  width='8' height='8' fill='none' viewBox='0 0 6 4'>
                                        <path d='M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z'>
                                        </path>
                                    </svg>
                                </button>
                                <div className='dropdown-menu'>
                                    <a className='dropdown-item' href='#'>EEE</a>
                                    <a className='dropdown-item' href='#'>Another action</a>
                                    <a className='dropdown-item' href='#'>Something else here</a>
                                </div>
                            </li>
                            <li className=''>
                                <button type='button'
                                    data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'
                                >
                                    Support
                                    <svg  width='8' height='8' fill='none' viewBox='0 0 6 4'>
                                        <path d='M.471 0L0 .471 2.828 3.3 5.657.47 5.185 0 2.828 2.357.471 0z'>
                                        </path>
                                    </svg>
                                </button>
                                <div className='dropdown-menu'>
                                    <a className='dropdown-item' href='#'>EEE</a>
                                    <a className='dropdown-item' href='#'>Another action</a>
                                    <a className='dropdown-item' href='#'>Something else here</a>
                                </div>
                            </li>
                            <li className=''><a href='/pricing'>Pricing</a></li>
                        </ul>

                        <ul>
                            <li className='' ><a href='/signin'>Sign In</a></li>
                            <li className='' ><a href='/s'>Create Sandbox</a></li>
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}
