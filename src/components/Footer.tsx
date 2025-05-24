/**
 * Footer Component
 *
 * @component
 * @description A simple footer component intended for displaying application-wide information,
 * such as credits or copyright details. It occupies the full width at the bottom of the layout.
 *
 * @returns {ReactNode} A `div` element serving as the application's footer,
 * containing a credit notice.
 */
function Footer(): React.ReactNode {
    return (
        <div
            style={{
                gridColumn: "1 / 5", // Ensures the footer spans all columns in a grid layout
            }}
            className="flex border-t-2 border-white py-1 px-2 text-[0.5rem] dark:border-white/30" // Styles for top border, padding, and small text size
        >
            <div className="mx-auto"></div> {/* Used for spacing/alignment */}
            <div>Made by Ozone</div> {/* Displaying the credit */}
        </div>
    );
}

export default Footer;
