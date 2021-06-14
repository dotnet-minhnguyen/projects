import React from 'react'

export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <section>
                    <ul>
                        <li className='header'><h6  className='header'>Product</h6></li>
                        <li><span><a href='/ide'>Online IDE</a></span></li>
                        <li><span><a href='/embeds'>Embed</a></span></li>
                        <li><span><a href='/ci'>Maysoft CI</a></span></li>
                        <li><span><a href='/team'>Teams</a></span></li>
                    </ul>
                    <ul>
                        <li className='header'><h6  className='header'>Explore</h6></li>
                        <li><span><a href='/explore'>Featured Maysoft</a></span></li>
                        <li><span><a href='/search'>Search Maysoft</a></span></li></ul>
                    <ul>
                        <li className='header'><h6  className='header'>Use Cases</h6></li>
                        <li><span><a href='/prototyping'>Prototyping</a></span></li>
                        <li><span><a href='/learning'>Learning</a></span></li>
                        <li><span><a href='/hiring'>Hiring</a></span></li>
                        <li><span><a href='/onboarding'>Onboarding</a></span></li>
                        <li><span><a href='/collaboration'>Collaboration</a></span></li>
                        <li><span><a href='/open-source'>Open Source</a></span></li>
                        <li><span><a href='/devrel'>DevRel</a></span></li>
                    </ul>
                    <ul>
                        <li className='header'><h6  className='header'>About</h6></li>
                        <li><span><a href='/company'>Company</a></span></li>
                        <li><span><a href='/blog'>Blog</a></span></li>
                        <li><span><a href='/pricing'>Pricing</a></span></li>
                        <li><span><a href='/jobs'>Careers</a></span></li>
                        <li><span><a href='/legal'>Legal</a></span></li>
                    </ul>
                    <ul>
                        <li className='header'><h6  className='header'>Support</h6></li>
                        <li><span><a href='/docs'>Documentation</a></span></li>
                        <li><span><a href='mailto:devmaysoft@gmail.com'>ContactSupport</a></span></li>
                        <li><span><a href='/status'>Status</a></span></li>
                    </ul>
                </section>
                <ul className='display-flex justify-content-center'>
                    <li><a target='_blank'  rel='noopener' title='Go to Github' href='https://github.com/devmaysoft'><svg width='18' height='18'
                        fill='none' viewBox='0 0 18 18'>
                        <path fill='#9d9d9d' fill-rule='evenodd'
                            d='M4 0a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V4a4 4 0 00-4-4H4zm10.195 6.063a6.05 6.05 0 00-2.183-2.238A5.759 5.759 0 009 3a5.76 5.76 0 00-3.012.825 6.05 6.05 0 00-2.183 2.238A6.132 6.132 0 003 9.15c0 1.34.381 2.546 1.145 3.616.763 1.07 1.748 1.811 2.956 2.222.141.027.245.008.313-.056a.317.317 0 00.101-.24c0-.016 0-.16-.003-.432-.003-.273-.004-.51-.004-.713l-.18.032c-.115.021-.26.03-.434.028a3.22 3.22 0 01-.543-.056 1.2 1.2 0 01-.523-.24 1.016 1.016 0 01-.344-.493l-.078-.184a2.011 2.011 0 00-.246-.408.95.95 0 00-.34-.305l-.054-.04a.582.582 0 01-.172-.208c-.016-.037-.003-.068.039-.092a.496.496 0 01.226-.036l.157.024c.104.021.233.085.386.192.154.107.28.246.38.416a1.4 1.4 0 00.433.5c.169.116.34.173.511.173.172 0 .32-.013.446-.04.125-.027.242-.067.351-.12.047-.358.175-.633.383-.825a5.226 5.226 0 01-.8-.144 3.148 3.148 0 01-.735-.313 2.117 2.117 0 01-.629-.536 2.604 2.604 0 01-.41-.841 4.092 4.092 0 01-.16-1.201c0-.646.206-1.196.617-1.65-.193-.486-.175-1.03.055-1.634.15-.048.375-.012.672.108.296.12.514.224.652.309.138.085.249.157.332.216A5.42 5.42 0 019 5.971c.515 0 1.015.07 1.5.208l.297-.192c.203-.128.443-.246.718-.353.276-.106.488-.136.633-.088.235.604.256 1.148.063 1.634.411.454.617 1.004.617 1.65 0 .454-.053.855-.16 1.205-.107.35-.245.63-.414.84-.17.212-.38.39-.633.533a3.15 3.15 0 01-.734.313 5.224 5.224 0 01-.801.144c.27.24.406.62.406 1.137v1.69c0 .096.033.176.098.24s.168.083.309.056c1.208-.411 2.194-1.152 2.957-2.222C14.617 11.696 15 10.49 15 9.15a6.138 6.138 0 00-.805-3.087z'
                            clip-rule='evenodd'></path>
                    </svg></a></li>

                    <li><a target='_blank'  rel='noopener' title='Go to Youtube' href='https://youtube.com/maysoft'><svg width='18' height='18'
                        fill='none' viewBox='0 0 18 18'>
                        <path fill='#9d9d9d' fill-rule='evenodd'
                            d='M4 0a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V4a4 4 0 00-4-4H4zm10.195 6.063a6.05 6.05 0 00-2.183-2.238A5.759 5.759 0 009 3a5.76 5.76 0 00-3.012.825 6.05 6.05 0 00-2.183 2.238A6.132 6.132 0 003 9.15c0 1.34.381 2.546 1.145 3.616.763 1.07 1.748 1.811 2.956 2.222.141.027.245.008.313-.056a.317.317 0 00.101-.24c0-.016 0-.16-.003-.432-.003-.273-.004-.51-.004-.713l-.18.032c-.115.021-.26.03-.434.028a3.22 3.22 0 01-.543-.056 1.2 1.2 0 01-.523-.24 1.016 1.016 0 01-.344-.493l-.078-.184a2.011 2.011 0 00-.246-.408.95.95 0 00-.34-.305l-.054-.04a.582.582 0 01-.172-.208c-.016-.037-.003-.068.039-.092a.496.496 0 01.226-.036l.157.024c.104.021.233.085.386.192.154.107.28.246.38.416a1.4 1.4 0 00.433.5c.169.116.34.173.511.173.172 0 .32-.013.446-.04.125-.027.242-.067.351-.12.047-.358.175-.633.383-.825a5.226 5.226 0 01-.8-.144 3.148 3.148 0 01-.735-.313 2.117 2.117 0 01-.629-.536 2.604 2.604 0 01-.41-.841 4.092 4.092 0 01-.16-1.201c0-.646.206-1.196.617-1.65-.193-.486-.175-1.03.055-1.634.15-.048.375-.012.672.108.296.12.514.224.652.309.138.085.249.157.332.216A5.42 5.42 0 019 5.971c.515 0 1.015.07 1.5.208l.297-.192c.203-.128.443-.246.718-.353.276-.106.488-.136.633-.088.235.604.256 1.148.063 1.634.411.454.617 1.004.617 1.65 0 .454-.053.855-.16 1.205-.107.35-.245.63-.414.84-.17.212-.38.39-.633.533a3.15 3.15 0 01-.734.313 5.224 5.224 0 01-.801.144c.27.24.406.62.406 1.137v1.69c0 .096.033.176.098.24s.168.083.309.056c1.208-.411 2.194-1.152 2.957-2.222C14.617 11.696 15 10.49 15 9.15a6.138 6.138 0 00-.805-3.087z'
                            clip-rule='evenodd'></path>
                    </svg></a></li>
                    <li><a target='_blank'  rel='noopener' title='Go to Twitter' href='https://twitter.com/maysoft12'><svg width='18' height='18' fill='none'
                        viewBox='0 0 18 18'>
                        <path fill='#9d9d9d'
                            d='M0 4a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H4a4 4 0 01-4-4V4zm13.263 2.328c.451-.267.788-.684.947-1.173a4.33 4.33 0 01-1.368.514A2.17 2.17 0 0011.269 5c-1.189 0-2.154.949-2.154 2.12 0 .166.018.329.056.484A6.15 6.15 0 014.73 5.388a2.08 2.08 0 00-.292 1.066c0 .736.381 1.385.959 1.764-.342-.01-.677-.1-.976-.264v.027c0 1.027.743 1.884 1.729 2.079a2.22 2.22 0 01-.973.036 2.151 2.151 0 002.013 1.473 4.37 4.37 0 01-2.676.906c-.174 0-.346-.008-.514-.028a6.156 6.156 0 003.302.953c3.962 0 6.129-3.231 6.129-6.034a5.01 5.01 0 00-.006-.274 4.339 4.339 0 001.074-1.097c-.392.17-.809.283-1.236.333z'>
                        </path>
                    </svg></a></li>
                    <li><a target='_blank'  rel='noopener' title='Go to Spectrum' href='https://spectrum.chat/devmaysoft'><svg width='18' height='18' fill='none'
                        viewBox='0 0 18 18'>
                        <path fill='#9d9d9d'
                            d='M0 4a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H4a4 4 0 01-4-4V4zm4 4c0 .394.106 1 .5 1h1C7.336 9 9 10.664 9 12.5v1c0 .394.106.5.5.5H13c.394 0 1-.106 1-.5v-1C14 8.04 9.96 4 5.5 4h-1c-.394 0-.5.606-.5 1v3z'>
                        </path>
                    </svg></a></li>
                </ul>
                <span className='display-flex justify-content-center'>Copyright © 2013-{new Date().getFullYear()} Maysoft Company .Ltd, All rights reserved.</span>
            </footer>
        )
    }
}
