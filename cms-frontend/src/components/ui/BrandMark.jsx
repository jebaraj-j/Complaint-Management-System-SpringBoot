function BrandMark({ inverse = false }) {
    return (
        <span
            aria-hidden="true"
            style={{ display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: 8, background: inverse ? "#ffffff" : "#173b7a", color: inverse ? "#173b7a" : "#ffffff", fontSize: 13, fontWeight: 700, letterSpacing: "-0.06em" }}
        >
            C
        </span>
    );
}

export default BrandMark;
