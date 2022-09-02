import { Box, HStack, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { resolveIPFS } from 'utils/resolveIPFS';
import apiPost from 'utils/apiPost';
import axios from 'axios';

const NFTCard = ({ nftAddress, filterQuery }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const [nftData, setNftData] = useState({ contractType: '', name: '', symbol: '', metadata: '' });
  const [filterSymbol, setFilterSymbol] = useState();

  const getNFTMetadata = async () => {
    const options = {
      network: 'mainnet',
      address: nftAddress,
    };
    const response = await apiPost('/SolApi/nft/getNFTMetadata', options);
    const result = await axios.get(`${response.metaplex.metadataUri}`, {
      headers: {
        'content-type': 'application/json',
      },
    });
    setFilterSymbol(response.symbol);
    setNftData({
      contractType: response.standard,
      name: response.name,
      symbol: response.symbol,
      metadata: result.data,
    });
  };

  useEffect(() => {
    if (nftAddress) {
      getNFTMetadata();
    }
  }, [nftAddress]);

  if (filterSymbol?.toLowerCase().includes(filterQuery)) {
    return (
      <>
        <Box bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
          <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
            <Image
              src={resolveIPFS(nftData?.metadata?.image)}
              alt={'nft'}
              minH="150px"
              minW="150px"
              maxH="150px"
              maxW="150px"
              boxSize="100%"
              objectFit="fill"
            />
          </Box>
          <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2}>
            {nftData?.name ? nftData?.name : <>no name</>}
          </Box>
          <HStack alignItems={'center'}>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller">
              {nftData?.contractType} standard
            </Box>
          </HStack>
          <SimpleGrid columns={1} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
            <Box>
              <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
                Symbol
              </Box>
              <Box as="h4" noOfLines={1} fontSize="sm">
                {nftData?.symbol ? nftData?.symbol : <>no symbol</>}
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </>
    );
  }
  return null;
};

export default NFTCard;
