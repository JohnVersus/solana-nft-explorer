import { VStack, Container, Box, Flex, HStack, Input, Button, Heading, Center } from '@chakra-ui/react';
import { NFTCard } from 'components/modules';
import { Grid } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Footer } from 'components/modules';
import Head from 'next/head';
import { ColorModeButton, MoralisLogo } from 'components/elements';
import apiPost from '../src/utils/apiPost';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const HomePage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [pageResult, setPageResult] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const inputHandler = (e) => {
    const Text = e.target.value;
    setSearchInput(Text);
  };

  const pageInputHandler = (e) => {
    setPageResult([]);
    const Text = e.target.value;
    if (Number(Text) <= Math.ceil(searchResult.length / 10)) {
      setPage(Number(Text));
    } else {
      setPage(page);
    }
  };

  const queryHandler = (e) => {
    const Text = e.target.value.toLowerCase();
    setQuery(Text);
  };

  const prevPage = () => {
    setPageResult([]);
    if (page !== 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    setPageResult([]);
    if (page < Math.ceil(searchResult.length / 10)) {
      setPage(page + 1);
    }
  };

  const loadPage = () => {
    setPageResult(searchResult?.slice((page - 1) * 10, page * 10));
  };

  const nftSearch = async () => {
    setSearchResult(() => null);
    setQuery('');
    setPage(1);
    if (searchInput) {
      const options = {
        network: 'mainnet',
        address: searchInput,
      };
      const response = await apiPost('/SolApi/account/getNFTs', options);
      setSearchResult(() => response);
    }
  };

  useEffect(() => {
    loadPage();
  }, [searchResult, page]);

  return (
    <>
      <Head>
        <title>{'Solana NFT Explorer | ETH Boilerplate'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* NavBar with Search Input */}
      <Box borderBottom="1px" borderBottomColor="chakra-border-color">
        <Container maxW="container.xl" p={'10px'}>
          <Flex align="center" justify="space-between">
            <MoralisLogo />
            {/* searchbar  */}
            <Flex align="center" gap={4}>
              <Input variant="filled" placeholder="Enter Wallet Address.." width={500} onInput={inputHandler} />
              <Button colorScheme="gray" onClick={nftSearch}>
                Search
              </Button>
            </Flex>
            <HStack gap={'10px'}>
              <ColorModeButton />
            </HStack>
          </Flex>
        </Container>
      </Box>
      {/* App Container */}
      <Container maxW="container.lg" p={3} as="main" minH="73vh">
        <Flex width="full" justifyContent="space-between" marginBottom={'2'}>
          <Heading size={'lg'}>Solana NFT Explorer</Heading>
          {searchResult?.length > 0 && (
            <>
              <Box>
                <Button colorScheme="teal" variant="ghost" onClick={prevPage} disabled={page === 1}>
                  <ArrowLeftIcon />
                </Button>
                <Input
                  textAlign={'right'}
                  placeholder={page}
                  htmlSize={2}
                  width="auto"
                  onInput={pageInputHandler}
                  variant="flushed"
                  value={page}
                />
                /{searchResult && Math.ceil(searchResult.length / 10)}
                <Button
                  colorScheme="teal"
                  variant="ghost"
                  onClick={nextPage}
                  disabled={page >= Math.ceil(searchResult.length / 10)}
                >
                  <ArrowRightIcon />
                </Button>
                <Input variant="filled" placeholder="Filter.." width={200} onInput={queryHandler} />
              </Box>
            </>
          )}
        </Flex>
        <VStack w={'full'} h={'650'} scrollBehavior={'auto'} borderWidth={'thin'} boxShadow={'inherit'} padding={'1'}>
          {pageResult?.length > 0 ? (
            <Grid templateColumns="repeat(5, 1fr)" gap={6} overflow="auto">
              {pageResult?.map((e, i) => {
                return <NFTCard key={i} nftAddress={e.mint} filterQuery={query} />;
              })}
            </Grid>
          ) : (
            <Center height={500} color="GrayText">
              <i>No Data</i>
            </Center>
          )}
        </VStack>
      </Container>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
