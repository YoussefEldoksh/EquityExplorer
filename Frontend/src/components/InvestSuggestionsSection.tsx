import { Card, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import apple_logo from '../assets/logos/apple-logo.svg';
import microsoft_logo from '../assets/logos/microsoft-logo.svg';
import tesla_logo from '../assets/logos/tesla-logo.svg';
import amazon_logo from '../assets/logos/amazon-logo.svg';
import google_logo from '../assets/logos/google-logo.svg';
import vanguard_logo from '../assets/logos/vanguard_logo.svg';
import ishares_logo from '../assets/logos/ishares-logo.svg';
import ark_invest_logo from '../assets/logos/ark-Invest-logo.svg';
import spdr_logo from '../assets/logos/spdr-logo.svg';
import fidelity_logo from '../assets/logos/fidelity-investment-logo.svg';
import trowe_price_logo from '../assets/logos/trow-logo.svg';
import capital_group_logo from '../assets/logos/capital_group_american_funds-logo.svg';
import dodge_and_cox_logo from '../assets/logos/Dodge-and-cox-logo.png';
import aberdeen_logo from '../assets/logos/aberdeen-logo.svg';
import vaneck_logo from '../assets/logos/vaneck-logo.svg';
import barrick_logo from '../assets/logos/barrick-logo.svg';

function InvestSuggestions() {
  const companyStocks = [
    {
      name: 'Apple',
      symbol: 'AAPL',
      logo: apple_logo,
    },
    {
      name: 'Microsoft',
      symbol: 'MSFT',
      logo: microsoft_logo,
    },
    {
      name: 'Tesla',
      symbol: 'TSLA',
      logo: tesla_logo,
    },
    {
      name: 'Amazon',
      symbol: 'AMZN',
      logo: amazon_logo,
    },
    {
      name: 'Google',
      symbol: 'GOOGL',
      logo: google_logo,
    },
  ];

  const equityFunds = [
    {
      name: 'Vanguard S&P 500 ETF',
      symbol: 'VOO',
      logo: vanguard_logo,
    },
    {
      name: 'iShares Core S&P 500',
      symbol: 'IVV',
      logo: ishares_logo,
    },
    {
      name: 'ARK Innovation ETF',
      symbol: 'ARKK',
      logo: ark_invest_logo,
    },
    {
      name: 'SPDR S&P 500 ETF',
      symbol: 'SPY',
      logo: spdr_logo,
    },
    {
      name: 'Fidelity Blue Chip',
      symbol: 'FBGRX',
      logo: fidelity_logo,
    },
  ];

  const mutualFunds = [
    {
      name: 'Vanguard Total Market',
      symbol: 'VTSAX',
      logo: vanguard_logo,
    },
    {
      name: 'Fidelity Contrafund',
      symbol: 'FCNTX',
      logo: fidelity_logo,
    },
    {
      name: 'T. Rowe Price Growth',
      symbol: 'PRGFX',
      logo: trowe_price_logo,
    },
    {
      name: 'American Growth Fund',
      symbol: 'AGTHX',
      logo: capital_group_logo,
    },
    {
      name: 'Dodge & Cox',
      symbol: 'DODGX',
      logo: dodge_and_cox_logo,
    },
  ];

  const goldAssets = [
    {
      name: 'SPDR Gold Shares',
      symbol: 'GLD',
      logo: spdr_logo,
    },
    {
      name: 'iShares Gold Trust',
      symbol: 'IAU',
      logo: ishares_logo,
    },
    {
      name: 'Aberdeen Gold',
      symbol: 'SGOL',
      logo: aberdeen_logo,
    },
    {
      name: 'VanEck Gold Miners',
      symbol: 'GDX',
      logo: vaneck_logo,
    },
    {
      name: 'Barrick Gold',
      symbol: 'GOLD',
      logo: barrick_logo,
    },
  ];
  const renderGrid = (data: any[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
      {data.map((item: any, i: number) => (
        <div key={i} className="bg-zinc-200 p-3 flex items-center gap-3">
          <img
            src={item.logo}
            alt={item.name}
            className="w-10 h-10 rounded-full bg-white p-1"
          />
          <div>
            <p className="font-semibold text-sm">{item.name}</p>
            <p className="text-xs text-zinc-500">{item.symbol}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full my-5 px-5">
      <div className="w-full py-8 px-8 mb-6">
        <h2 className="text-4xl font-bold">
          What tools do financial markets provide ? 
        </h2>
      </div>
      <div className="flex w-full justify-center my-5 px-5">
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="w-full bg-zinc-300 p-1 rounded-none flex">
            <TabsTrigger value="company" className="flex-1 rounded-none">
              Company Stocks
            </TabsTrigger>

            <TabsTrigger value="equity" className="flex-1 rounded-none">
              Equity Funds
            </TabsTrigger>

            <TabsTrigger value="mutual" className="flex-1 rounded-none">
              Mutual Funds
            </TabsTrigger>

            <TabsTrigger value="gold" className="flex-1 rounded-none">
              Gold
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Stocks</CardTitle>
                {renderGrid(companyStocks)}
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="equity">
            <Card>
              <CardHeader>
                <CardTitle>Equity Funds</CardTitle>
                {renderGrid(equityFunds)}
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="mutual">
            <Card>
              <CardHeader>
                <CardTitle>Mutual Funds</CardTitle>
                {renderGrid(mutualFunds)}
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="gold">
            <Card>
              <CardHeader>
                <CardTitle>Gold</CardTitle>
                {renderGrid(goldAssets)}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default InvestSuggestions;
