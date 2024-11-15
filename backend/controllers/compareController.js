const queryAsync = require("../config/queryAsync");

exports.getCompareBadData = async (req, res) => {
  try {
    const { compares, date } = req.body;
    let sql =
      "SELECT cnt FROM Dat_99 WHERE group_id = ? AND DATE(time_dat) = ?;";
    const cnts = await Promise.all(
      compares.map(async (compare) => {
        const locationCnts = {};
        await Promise.all(
          compare.compareIds.map(async (compareId) => {
            const result = await queryAsync(sql, [compareId, date]);
            if (result.length > 0) {
              const locationId = compare.locationId;
              if (!locationCnts[locationId]) {
                locationCnts[locationId] = [];
              }
              locationCnts[locationId].push(result[0].cnt);
            }
          })
        );

        return Object.keys(locationCnts).map((locationId) => ({
          locationId: Number(locationId),
          cnts:
            locationCnts[locationId].length > 0 ? locationCnts[locationId] : [],
        }));
      })
    );
    const flattenedCnts = cnts.flat();
    const finalCnts = compares.map((compare) => ({
      locationId: compare.locationId,
      cnts:
        flattenedCnts.find((cnt) => cnt.locationId === compare.locationId)
          ?.cnts || [],
    }));
    sql =
      "SELECT id FROM bad_data WHERE command_id = 99 AND cnt = ? AND DATE(time) = ?;";
    const data = await Promise.all(
      finalCnts.map(async (locationCnt) => {
        const badDataIds = await Promise.all(
          locationCnt.cnts.map(async (cnt) => {
            const result = await queryAsync(sql, [cnt, date]);
            return result.length > 0 ? result.map((r) => r.id) : [];
          })
        );
        const allBadDataIds = badDataIds.flat();
        return {
          locationId: locationCnt.locationId,
          badData: allBadDataIds.length > 0 ? allBadDataIds : [],
        };
      })
    );
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};
