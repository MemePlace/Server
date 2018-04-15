exports.hotScore = function(score, datetime) {
    const order = Math.log10(Math.max(Math.abs(score), 1));
    let sign = (score > 0) ? 1: (score < 0) ? -1: 0;
    const seconds = parseInt((new Date(datetime).getTime())/1000) - 1523738286;
    return (sign * order + seconds / 45000).toFixed(7);
};
