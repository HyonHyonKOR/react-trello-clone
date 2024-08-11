import { useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinPrice } from "./api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 20px 0;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const BackBtn = styled.button`
  position: absolute;
  border: none;
  left: 0px;
  bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
`;

const Loader = styled.div`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ $isAcitve: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isAcitve ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

interface RouteState {
  state: {
    name: string;
  };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

interface PriceData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Coin = () => {
  const { coinId } = useParams();
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const { isLoading: infoloading, data: InfoData } = useQuery<InfoData>({
    queryKey: ["info", coinId],
    queryFn: () => fetchCoinInfo(coinId),
  });

  const { isLoading: tickersLoading, data: PriceData } = useQuery<PriceData>({
    queryKey: ["price", coinId],
    queryFn: () => fetchCoinPrice(coinId),
  });

  const loading = infoloading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading.." : InfoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading.." : InfoData?.name}
        </Title>
        <BackBtn>
          <Link to={"/"}>&larr;</Link>
        </BackBtn>
      </Header>
      {loading ? (
        <Loader>"Loading..."</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{InfoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{InfoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Type:</span>
              <span>{InfoData?.type}</span>
            </OverviewItem>
          </Overview>
          <Description>
            {InfoData?.name} is a {InfoData?.type}.Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Impedit fugit maxime, culpa unde sint
            delectus quo enim veniam magnam amet commodi dicta sunt cum
            excepturi dolore, est nam, ab nulla? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Atque, unde beatae sed assumenda autem
            ratione omnis. Voluptatum, eos quaerat veniam consectetur aliquam
            amet aliquid nesciunt, placeat nobis voluptates inventore autem!
          </Description>
          <Overview>
            <OverviewItem>
              <span>Max Price:</span>
              <span>{PriceData?.high}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Low Price:</span>
              <span>{PriceData?.low}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab $isAcitve={chartMatch !== null}>
              <Link to={`chart`}>Chart</Link>
            </Tab>
            <Tab $isAcitve={priceMatch !== null}>
              <Link to={`price`}>Price</Link>
            </Tab>
          </Tabs>
        </>
      )}
      <Outlet context={{ coinId }} />
    </Container>
  );
};

export default Coin;
