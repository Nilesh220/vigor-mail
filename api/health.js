const { storeConfig, sameOriginOnly } = require('./_lib');

module.exports = (req, res) => {
  sameOriginOnly(res);
  res.status(200).json({
    ok: true,
    service: 'VigorLaunchpad Mail Studio',
    storage: !!storeConfig(),
    accessRequired: !!process.env.TEAM_ACCESS_CODE,
  });
};
