import React from 'react'

/**
 * Icon
 * 
 * @param {object} props The props object
 * @param {string} props.icon Icon name
 * @param {string} props.addClass HTML class of icon
 * 
 * @returns {JSX.Element} Span element of the icon
 */
export default function Icon({icon, addClass=""}) {
  return (
    <span className={`material-icons-outlined ${addClass}`}>
        {icon}
    </span>
  )
}
