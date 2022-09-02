import Moralis from 'moralis';

export default async function handler(req, res) {
  const { address, network } = req.body;
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try {
    const data = await Moralis.SolApi.nft.getNFTMetadata({
      network,
      address,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
