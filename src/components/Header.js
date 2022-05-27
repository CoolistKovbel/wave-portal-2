import React from 'react'
import { FaGithubSquare, FaTwitterSquare, FaYoutubeSquare } from "react-icons/fa";

function Header() {
  return (
    <header className='header'>
      <h2>dePage</h2>
      <ul>
        <li>
          <a href="https://github.com/CoolistKovbel" target="_blank"><FaGithubSquare /></a>
        </li>
        <li>
          <a href='https://twitter.com/shpintzOG' target="_blank"><FaTwitterSquare /></a>
        </li>
        <li>
          <a href='https://www.youtube.com/channel/UCfrt7KmD4tK5v-Pdd6m_tow' target="_blank"><FaYoutubeSquare /></a>
        </li>
      </ul>
    </header>
  )
}

export default Header