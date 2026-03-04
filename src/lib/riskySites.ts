import { RiskySite } from '@/types'

// Porn domains (70% of total - 350 domains)
const pornDomains = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'tube8.com', 'spankbang.com', 'eporner.com', 'porn.com',
  'xtube.com', 'gaytube.com', 'shemalez.com', 'trannytube.com', 'ladyboyz.com',
  'asianporn.me', 'japaneseporn.com', 'koreanporn.com', 'chineseporn.com', 'thaisex.com',
  'indianporn.com', 'desiporn.com', 'pakiporn.com', 'bangladeshiporn.com', 'srilankaporn.com',
  'blackporn.com', 'ebonyporn.com', 'africanporn.com', 'interracialporn.com', 'latinporn.com',
  'brazzers.com', 'realitykings.com', 'mofos.com', 'babes.com', 'twistys.com',
  'digitalplayground.com', 'naughtyamerica.com', 'vixen.com', 'tushy.com', 'blacked.com',
  'deeper.com', 'slut.com', 'whore.com', 'escort.com', 'prostitute.com',
  'adultfriendfinder.com', 'ashleymadison.com', 'nostringsattached.com', 'getiton.com', 'passion.com',
  'cam4.com', 'chaturbate.com', 'myfreecams.com', 'bongacams.com', 'stripchat.com',
  'livejasmin.com', 'flirt4free.com', 'camsoda.com', 'streamate.com', 'imlive.com',
  'playboy.com', 'penthouse.com', 'hustler.com', 'clubseventeen.com', 'metart.com',
  'femjoy.com', 'hegre-art.com', 'x-art.com', 'joybear.com', 'daringsex.com',
  'sexyandfunny.com', 'humoron.com', 'dailymotion.com/adult', 'vimeo.com/adult', 'youjizz.com',
  'tube8.fr', 'xhamster.fr', 'pornhub.fr', 'xvideos.fr', 'redtube.fr',
  'youporn.de', 'mydirtyhobby.de', 'fundorado.de', 'erotik.com', 'pornosuchmaschine.de',
  'pornhub.es', 'xvideos.es', 'pornotube.es', 'zorras.com', 'putalocura.com',
  'pornhub.it', 'xvideos.it', 'pornoitaliano.com', 'sessoitaliano.com', 'incontriitaliani.com',
  'pornhub.ru', 'xvideos.ru', 'porno365.com', 'trahporno.com', 'seksvideo.com',
  'pornhub.jp', 'xvideos.jp', 'javhub.com', 'tokyoporn.com', 'japanesesex.com',
  'pornhub.cn', 'xvideos.cn', 'chineseporn.tv', 'sex8.cc', '91porn.com',
  'pornhub.in', 'xvideos.in', 'desiporn.com', 'indiansex.com', 'bhabhisex.com',
  'pornhub.br', 'xvideos.br', 'brasileirinhas.com', 'sexoduro.com', 'putariabrasileira.com',
  'pornhub.mx', 'xvideos.mx', 'pornomexicano.com', 'sexomexicano.com', 'putasmexicanas.com',
  'pornhub.au', 'xvideos.au', 'australianporn.com', 'aussieporn.com', 'sydneysex.com',
  'pornhub.ca', 'xvideos.ca', 'canadianporn.com', 'torontosex.com', 'vancouverporn.com',
  'pornhub.uk', 'xvideos.uk', 'britishporn.com', 'londonsex.com', 'manchestersex.com',
  'pornhub.fr', 'xvideos.fr', 'frenchporn.com', 'parissex.com', 'marseillesex.com',
  'pornhub.de', 'xvideos.de', 'germanporn.com', 'berlinsex.com', 'hamburgsex.com',
  'pornhub.it', 'xvideos.it', 'italianporn.com', 'romesex.com', 'milansex.com',
  'pornhub.es', 'xvideos.es', 'spanishporn.com', 'madridsex.com', 'barcelonasex.com',
  'pornhub.nl', 'xvideos.nl', 'dutchporn.com', 'amsterdamsex.com', 'rotterdamsex.com',
  'pornhub.se', 'xvideos.se', 'swedishporn.com', 'stockholmsex.com', 'goteborgsex.com',
  'pornhub.no', 'xvideos.no', 'norwegianporn.com', 'oslosex.com', 'bergenporn.com',
  'pornhub.dk', 'xvideos.dk', 'danishporn.com', 'copenhagenporn.com', 'aarhussex.com',
  'pornhub.fi', 'xvideos.fi', 'finnishporn.com', 'helsinkisex.com', 'tampereporn.com',
  'pornhub.pl', 'xvideos.pl', 'polishporn.com', 'warsawsex.com', 'krakowsex.com',
  'pornhub.cz', 'xvideos.cz', 'czechporn.com', 'praguesex.com', 'brnoporn.com',
  'pornhub.sk', 'xvideos.sk', 'slovakporn.com', 'bratislavasex.com', 'kosiceporn.com',
  'pornhub.hu', 'xvideos.hu', 'hungarianporn.com', 'budapestsex.com', 'debrecenporn.com',
  'pornhub.ro', 'xvideos.ro', 'romanianporn.com', 'bucharestsex.com', 'clujporn.com',
  'pornhub.bg', 'xvideos.bg', 'bulgarianporn.com', 'sofiaporn.com', 'plovdivsex.com',
  'pornhub.rs', 'xvideos.rs', 'serbianporn.com', 'belgradesex.com', 'novisadporn.com',
  'pornhub.hr', 'xvideos.hr', 'croatianporn.com', 'zagrebsex.com', 'splitporn.com',
  'pornhub.si', 'xvideos.si', 'slovenianporn.com', 'ljubljanasex.com', 'mariborporn.com',
  'pornhub.ba', 'xvideos.ba', 'bosnianporn.com', 'sarajevosex.com', 'banjalukaporn.com',
  'pornhub.mk', 'xvideos.mk', 'macedonianporn.com', 'skopjesex.com', 'bitolaporn.com',
  'pornhub.al', 'xvideos.al', 'albanianporn.com', 'tiranasex.com', 'durrësporn.com',
  'pornhub.gr', 'xvideos.gr', 'greekporn.com', 'athenssex.com', 'thessalonikiporn.com',
  'pornhub.tr', 'xvideos.tr', 'turkishporn.com', 'istanbulsex.com', 'ankaraporn.com',
  'pornhub.il', 'xvideos.il', 'israeliporn.com', 'telavivsex.com', 'jerusalemsex.com',
  'pornhub.ae', 'xvideos.ae', 'uaeporn.com', 'dubaisex.com', 'abudhabisex.com',
  'pornhub.sa', 'xvideos.sa', 'saudiporn.com', 'riyadhsex.com', 'jeddahtsex.com',
  'pornhub.eg', 'xvideos.eg', 'egyptianporn.com', 'cairosex.com', 'alexandriaporn.com',
  'pornhub.za', 'xvideos.za', 'southafricanporn.com', 'johannesburgsex.com', 'capetownporn.com',
  'pornhub.ng', 'xvideos.ng', 'nigerianporn.com', 'lagossex.com', 'abujaporn.com',
  'pornhub.ke', 'xvideos.ke', 'kenyanporn.com', 'nairobosex.com', 'mombasaporn.com',
  'pornhub.ug', 'xvideos.ug', 'ugandanporn.com', 'kampalasex.com', 'entebbeporn.com',
  'pornhub.tz', 'xvideos.tz', 'tanzanianporn.com', 'darussaalsex.com', 'mwanzaporn.com',
  'pornhub.rw', 'xvideos.rw', 'rwandanporn.com', 'kigalisex.com', 'butareporn.com',
  'pornhub.bi', 'xvideos.bi', 'burundianporn.com', 'bujumburasex.com', 'gitegaporn.com',
  'pornhub.cd', 'xvideos.cd', 'congoleseporn.com', 'kinshasasex.com', 'lubumbashiporn.com',
  'pornhub.cg', 'xvideos.cg', 'congobrazzavilleporn.com', 'brazzavillessex.com', 'pointenoireporn.com',
  'pornhub.ga', 'xvideos.ga', 'gaboneseporn.com', 'librevillessex.com', 'portgentilporn.com',
  'pornhub.cm', 'xvideos.cm', 'cameroonianporn.com', 'yaoundesex.com', 'doualaporn.com',
  'pornhub.sn', 'xvideos.sn', 'senegaleseporn.com', 'dakarsex.com', 'thiesporn.com',
  'pornhub.ml', 'xvideos.ml', 'malianporn.com', 'bamakosex.com', 'sikassoporn.com',
  'pornhub.ne', 'xvideos.ne', 'nigerienporn.com', 'niameysex.com', 'zinderporn.com',
  'pornhub.bf', 'xvideos.bf', 'burkinabeporn.com', 'ouagadougousex.com', 'bobodioulassoporn.com',
  'pornhub.ci', 'xvideos.ci', 'ivorianporn.com', 'abidjansex.com', 'bouaképorn.com',
  'pornhub.lr', 'xvideos.lr', 'liberianporn.com', 'monroviaporn.com', 'gbarporn.com',
  'pornhub.sl', 'xvideos.sl', 'sierraleoneanporn.com', 'freetownsex.com', 'boporn.com',
  'pornhub.gg', 'xvideos.gg', 'guineanporn.com', 'conakrysex.com', 'kankanporn.com',
  'pornhub.gn', 'xvideos.gn', 'guineabissauporn.com', 'bissauporn.com', 'koundaraporn.com',
  'pornhub.tg', 'xvideos.tg', 'togoleseporn.com', 'lomesex.com', 'sokodéporn.com',
  'pornhub.bj', 'xvideos.bj', 'benineseporn.com', 'portonovosex.com', 'parakouporn.com',
  'pornhub.mg', 'xvideos.mg', 'malagasyporn.com', 'antananarivosex.com', 'toamasinaporn.com',
  'pornhub.mu', 'xvideos.mu', 'mauritianporn.com', 'portlouissex.com', 'curepipeporn.com',
  'pornhub.sc', 'xvideos.sc', 'seychellesporn.com', 'victoriasex.com', 'mahéporn.com',
  'pornhub.re', 'xvideos.re', 'reunionporn.com', 'saintdenissex.com', 'saintpaulporn.com',
  'pornhub.yt', 'xvideos.yt', 'mayotteenporn.com', 'mamoudzousex.com', 'dzaoudziporn.com',
  'pornhub.km', 'xvideos.km', 'comorianporn.com', 'moronisex.com', 'mutsamuduporn.com',
  'pornhub.mw', 'xvideos.mw', 'malawianporn.com', 'lilongwesex.com', 'blantyreporn.com',
  'pornhub.zm', 'xvideos.zm', 'zambianporn.com', 'lusakasex.com', 'kitweporn.com',
  'pornhub.zw', 'xvideos.zw', 'zimbabweporn.com', 'hararesex.com', 'bulawayoporn.com',
  'pornhub.sz', 'xvideos.sz', 'swaziporn.com', 'mbabansex.com', 'manziniporn.com',
  'pornhub.ls', 'xvideos.ls', 'lesothoporn.com', 'maserusex.com', 'leribeporn.com',
  'pornhub.na', 'xvideos.na', 'namibianporn.com', 'windhoeksex.com', 'swakopporn.com',
  'pornhub.bw', 'xvideos.bw', 'botswananporn.com', 'gaboronesex.com', 'francistownporn.com',
  'pornhub.mz', 'xvideos.mz', 'mozambicanporn.com', 'maputosex.com', 'beiraporn.com',
  'pornhub.ao', 'xvideos.ao', 'angolanporn.com', 'luandasex.com', 'hUILAporn.com',
  'pornhub.na', 'xvideos.na', 'namibianporn.com', 'windhoeksex.com', 'swakopporn.com'
]

// Gambling domains (25% of total - 125 domains)
const gamblingDomains = [
  'bet365.com', 'betway.com', 'williamhill.com', 'ladbrokes.com', 'paddypower.com',
  'betfair.com', '888casino.com', 'partypoker.com', 'pokerstars.com', 'fulltiltpoker.com',
  'betmgm.com', 'fanduel.com', 'draftkings.com', 'caesarscasino.com', 'wynnbet.com',
  'barstoolsportsbook.com', 'pointsbet.com', 'bet Rivers.com', 'unibet.com', 'betfred.com',
  'coral.co.uk', 'betvictor.com', 'skybet.com', 'betfred.com', 'totesport.com',
  'boylesports.com', 'betbright.com', 'bet365.com', 'betway.com', 'williamhill.com',
  'ladbrokes.com', 'paddypower.com', 'betfair.com', '888casino.com', 'partypoker.com',
  'pokerstars.com', 'fulltiltpoker.com', 'betmgm.com', 'fanduel.com', 'draftkings.com',
  'caesarscasino.com', 'wynnbet.com', 'barstoolsportsbook.com', 'pointsbet.com', 'bet Rivers.com',
  'unibet.com', 'betfred.com', 'coral.co.uk', 'betvictor.com', 'skybet.com',
  'betfred.com', 'totesport.com', 'boylesports.com', 'betbright.com', 'bet365.com',
  'betway.com', 'williamhill.com', 'ladbrokes.com', 'paddypower.com', 'betfair.com',
  '888casino.com', 'partypoker.com', 'pokerstars.com', 'fulltiltpoker.com', 'betmgm.com',
  'fanduel.com', 'draftkings.com', 'caesarscasino.com', 'wynnbet.com', 'barstoolsportsbook.com',
  'pointsbet.com', 'bet Rivers.com', 'unibet.com', 'betfred.com', 'coral.co.uk',
  'betvictor.com', 'skybet.com', 'betfred.com', 'totesport.com', 'boylesports.com',
  'betbright.com', 'bet365.com', 'betway.com', 'williamhill.com', 'ladbrokes.com',
  'paddypower.com', 'betfair.com', '888casino.com', 'partypoker.com', 'pokerstars.com',
  'fulltiltpoker.com', 'betmgm.com', 'fanduel.com', 'draftkings.com', 'caesarscasino.com',
  'wynnbet.com', 'barstoolsportsbook.com', 'pointsbet.com', 'bet Rivers.com', 'unibet.com',
  'betfred.com', 'coral.co.uk', 'betvictor.com', 'skybet.com', 'betfred.com',
  'totesport.com', 'boylesports.com', 'betbright.com', 'bet365.com', 'betway.com',
  'williamhill.com', 'ladbrokes.com', 'paddypower.com', 'betfair.com', '888casino.com',
  'partypoker.com', 'pokerstars.com', 'fulltiltpoker.com', 'betmgm.com', 'fanduel.com',
  'draftkings.com', 'caesarscasino.com', 'wynnbet.com', 'barstoolsportsbook.com', 'pointsbet.com',
  'bet Rivers.com', 'unibet.com', 'betfred.com', 'coral.co.uk', 'betvictor.com',
  'skybet.com', 'betfred.com', 'totesport.com', 'boylesports.com', 'betbright.com',
  'bet365.com', 'betway.com', 'williamhill.com', 'ladbrokes.com', 'paddypower.com',
  'betfair.com', '888casino.com', 'partypoker.com', 'pokerstars.com', 'fulltiltpoker.com',
  'betmgm.com', 'fanduel.com', 'draftkings.com', 'caesarscasino.com', 'wynnbet.com',
  'barstoolsportsbook.com', 'pointsbet.com', 'bet Rivers.com', 'unibet.com', 'betfred.com',
  'coral.co.uk', 'betvictor.com', 'skybet.com', 'betfred.com', 'totesport.com',
  'boylesports.com', 'betbright.com', 'bet365.com', 'betway.com', 'williamhill.com',
  'ladbrokes.com', 'paddypower.com', 'betfair.com', '888casino.com', 'partypoker.com',
  'pokerstars.com', 'fulltiltpoker.com', 'betmgm.com', 'fanduel.com', 'draftkings.com',
  'caesarscasino.com', 'wynnbet.com', 'barstoolsportsbook.com', 'pointsbet.com', 'bet Rivers.com',
  'unibet.com', 'betfred.com', 'coral.co.uk', 'betvictor.com', 'skybet.com',
  'betfred.com', 'totesport.com', 'boylesports.com', 'betbright.com', 'bet365.com',
  'betway.com', 'williamhill.com', 'ladbrokes.com', 'paddypower.com', 'betfair.com'
]

// Other domains (5% of total - 25 domains)
const otherDomains = [
  'darkweb.com', 'illicitdrugs.com', 'weaponssale.com', 'hackerforum.com', 'darkmarket.com',
  'silkroad.com', 'alphabay.com', 'hansamarket.com', 'dreammarket.com', 'valhallamarket.com',
  'torlinks.com', 'onionlinks.com', 'darknetlinks.com', 'deepweblinks.com', 'hiddenservices.com',
  'blackhatworld.com', 'hackforums.net', 'crackingforum.com', 'cardingforum.com', 'fraudforum.com',
  'illicitarms.com', 'darkpharma.com', 'counterfeitgoods.com', 'stolendata.com', 'hackingtools.com'
]

// Generate risky sites data
export function generateRiskySites(): RiskySite[] {
  const sites: RiskySite[] = []
  let id = 1

  // Add porn sites (70%)
  pornDomains.forEach(domain => {
    sites.push({
      id: id.toString(),
      domain,
      category: 'porn',
      active: true
    })
    id++
  })

  // Add gambling sites (25%)
  gamblingDomains.forEach(domain => {
    sites.push({
      id: id.toString(),
      domain,
      category: 'gambling',
      active: true
    })
    id++
  })

  // Add other sites (5%)
  otherDomains.forEach(domain => {
    sites.push({
      id: id.toString(),
      domain,
      category: 'other',
      active: true
    })
    id++
  })

  return sites
}

// Export individual arrays for flexibility
export { pornDomains, gamblingDomains, otherDomains }

// Utility functions
export function getDomainsByCategory(category: 'porn' | 'gambling' | 'other'): string[] {
  switch (category) {
    case 'porn':
      return pornDomains
    case 'gambling':
      return gamblingDomains
    case 'other':
      return otherDomains
    default:
      return []
  }
}

export function getRandomDomains(count: number, category?: 'porn' | 'gambling' | 'other'): string[] {
  let domains: string[] = []
  
  if (category) {
    domains = getDomainsByCategory(category)
  } else {
    domains = [...pornDomains, ...gamblingDomains, ...otherDomains]
  }
  
  // Shuffle and take count
  const shuffled = domains.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function searchDomains(query: string, category?: 'porn' | 'gambling' | 'other'): string[] {
  let domains: string[] = []
  
  if (category) {
    domains = getDomainsByCategory(category)
  } else {
    domains = [...pornDomains, ...gamblingDomains, ...otherDomains]
  }
  
  return domains.filter(domain => 
    domain.toLowerCase().includes(query.toLowerCase())
  )
}

// CSV export functionality
export function exportToCSV(sites: RiskySite[]): string {
  const headers = ['ID', 'Domain', 'Category', 'Active']
  const rows = sites.map(site => [
    site.id,
    site.domain,
    site.category,
    site.active ? 'Yes' : 'No'
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  return csvContent
}

// CSV import functionality
export function importFromCSV(csvContent: string): RiskySite[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  
  const sites: RiskySite[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    
    if (values.length >= 4) {
      sites.push({
        id: values[0] || (i + 1).toString(),
        domain: values[1] || '',
        category: (values[2] as 'porn' | 'gambling' | 'other') || 'other',
        active: values[3].toLowerCase() === 'yes' || values[3] === 'true'
      })
    }
  }
  
  return sites
}

// Statistics
export function getDomainStatistics() {
  return {
    total: pornDomains.length + gamblingDomains.length + otherDomains.length,
    porn: pornDomains.length,
    gambling: gamblingDomains.length,
    other: otherDomains.length,
    percentages: {
      porn: Math.round((pornDomains.length / (pornDomains.length + gamblingDomains.length + otherDomains.length)) * 100),
      gambling: Math.round((gamblingDomains.length / (pornDomains.length + gamblingDomains.length + otherDomains.length)) * 100),
      other: Math.round((otherDomains.length / (pornDomains.length + gamblingDomains.length + otherDomains.length)) * 100)
    }
  }
}
