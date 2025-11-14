const CopyRight = () => {
  return (
    <footer className="" style={{
      textAlign: "center",
      padding: "12px 0",
      backgroundColor: "#f3f3f3",
      fontSize: "1rem",
      color: "#555",
      borderTop: "1px solid #ddd",
      bottom:0,
      width:'100%',
      left:0
    }}>
      <span>
        © {new Date().getFullYear()} This product is a registered trademark of Exaltors Gamication Pvt. Ltd.
      </span>
    </footer>
  );
};

export default CopyRight;
