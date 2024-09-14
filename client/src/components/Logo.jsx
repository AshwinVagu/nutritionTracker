import React from 'react'

// Functional component for displaying the application logo
const Logo = () => {
    // Render JSX for the logo, containing an image element
    return (
        <div className="logo-container">
            {/* Display the logo image with an alt attribute */}
            <img className="logo" alt="WellnessWise Logo" src="logo.svg" />
        </div>
    )
}

export { Logo }