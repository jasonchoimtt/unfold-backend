/* eslint-disable */

export const event = {
    title: 'Umbrella Revolution',
    description: 'The Umbrella Movement is a loose pro-democracy political movement that was created spontaneously during the Hong Kong protests of 2014.',
    information: 'We are currently inviting some more contributors for the live stream. If you are interested, feel free to send a message to one of our contributors!\n',
    tags: [],
    location: 'Hong Kong',
    startedAt: '2014-09-28T16:00:00.000Z',
    endedAt: '2014-09-30T16:00:00.000Z',
    timezone: 8,
    roles: [
        {
            id: '01',
            type: 'OWNER',
            name: 'Lion Smith',
            description: 'Journalist working at Hong Kong Post.',
            image: '/res/avatar.jpg',
            online: true
        },
        {
            id: '02',
            type: 'CONTRIBUTOR',
            name: 'Doggy Chan',
            description: 'Experienced field reportor from CBC.',
            image: '/res/avatar2.jpg',
            online: true
        },
        {
            id: '03',
            type: 'CONTRIBUTOR',
            name: 'Isaac Clinton',
            description: 'Experienced correspondents from Britain Mail.',
            image: '/res/avatar3.jpg',
            online: true
        },
        {
            id: '04',
            type: 'CONTRIBUTOR',
            name: 'Camus Bush',
            description: 'A passionate amateur journalist.',
            image: '/res/avatar4.jpg',
            online: false
        },
        {
            id: '05',
            type: 'CONTRIBUTOR',
            name: 'Descrates Sanders',
            description: 'Greatest painter of all time.',
            image: '/res/avatar5.jpg',
            online: false
        },
        {
            id: '06',
            type: 'CONTRIBUTOR',
            name: 'Socrates Oilver',
            description: 'A professional journalist and part-time philosopher.',
            image: '/res/avatar6.jpg',
            online: false
        },
        {
            id: '07',
            type: 'TRANSLATOR',
            name: 'Vincent Chan',
            description: 'Good at French and painting.',
            image: '/res/avatar7.jpg',
            online: false
        },
        {
            id: '08',
            type: 'TRANSLATOR',
            name: 'Socrates da Oilver',
            description: 'A professional journalist and part-time philosopher.',
            image: '/res/avatar6.jpg',
            online: true
        },
        {
            id: '09',
            type: 'TRANSLATOR',
            name: 'Matias',
            description: 'Savior',
            image: '/res/avatar2.jpg',
            online: false
        }
    ]
};

export const posts = [
{
    contributor: '06',
    caption: '<p>Police are gathering at Wan Chai exhibition center as more protesters gathers in that area.</p>\n',
    createdAt: '2014-09-30T15:59:53Z',
    tags: ['WanChai', 'police', 'unverified']
}, {
    contributor: '05',
    caption: '<p><h3>Breaking: Protesters seem to be occupying Canton Road, Tsim Sha Tsui.</h3></p>\n',
    createdAt: '2014-09-30T15:05:19Z',
    tags: [ 'facebook', 'TsimShaTsui', 'CantonRoad', 'important' ],
    data: { url: 'https://www.facebook.com/socrec/photos/982100198483578/' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T14:15:44Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/stegersaurus/status/516953899001856000' }
}, {
    contributor: '05',
    caption: '<p>2200, dangerous sharp object spotted by HKFS volunteers near the venue. Already removed.</p>\n',
    createdAt: '2014-09-30T14:15:19Z',
    tags: [ 'facebook', 'Central' ],
    data: { url: 'https://www.facebook.com/hkfs1958/photos/a.10151401759847872.1073741825.269056797871/10152472622737872/' }
}, {
    contributor: '05',
    caption: '<p>2210, good atmosphere in Causeway Bay SOGO.</p>\n',
    createdAt: '2014-09-30T14:11:19Z',
    tags: [ 'facebook', 'CausewayBay' ],
    data: { url: 'https://www.facebook.com/UnitedSocialPress/photos/a.625319927500944.1073741845.579827748716829/831656010200667/' }
}, {
    contributor: '05',
    caption: '<p>2200, lawmaker Wong Yuk Man @ Mong Kok giving speech</p>\n',
    createdAt: '2014-09-30T14:08:19Z',
    tags: [ 'facebook', 'Mongkok' ],
    data: { url: 'https://www.facebook.com/passiontimes/photos/a.422169814512858.102977.420361564693683/765838946812608/' }
}, {
    contributor: '05',
    caption: '<p>2113, Causeway BayMTR station Exit F, protesters setup up obstacles.</p>\n',
    createdAt: '2014-09-30T13:22:22Z',
    tags: ['important', 'CausewayBay']
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T13:14:44Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/youngposthk/status/516938225143668736' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T13:11:44Z',
    tags: [ 'twitter', 'WanChai' ],
    data: { url: 'https://twitter.com/freakingcat/status/516937724004020225' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T13:10:44Z',
    tags: [ 'twitter', 'Admiralty' ],
    data: { url: 'https://twitter.com/freakingcat/status/516937921257947136' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T13:07:44Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/olivesophierose/status/516936747570049024' }
}, {
    contributor: '01',
    caption: '<p>[20:55] New protest fronts may be emerging. Tonight, protest organisers announced that the Sheung Shui MTR Station had been &quot;occupied&quot; but did not give details.</p>\n',
    createdAt: '2014-09-30T13:06:22Z',
    tags: ['important']
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-30T13:04:44Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/marcosharpy/status/516936109243121664' }
}, {
    contributor: '05',
    caption: '<p>Cambodia newspaper headlines.</p>\n',
    createdAt: '2014-09-30T12:04:13Z',
    data: { url: 'http://imgur.com/oSQSyeU' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T12:03:44Z',
    tags: [ 'twitter', 'Central' ],
    data: { url: 'https://twitter.com/youngposthk/status/516921176350662656' }
}, {
    contributor: '01',
    caption: '<p>[7:25] Sir Richard Ottaway of the UK Parliament Foreign Affairs Select Committee tells the BBC that they will continue to conduct an inquiry into Hong Kong, which would include looking at the agreement signed between Britain and China regarding Hong Kong. On China\'s demand that other countries stay out, he replied: &quot;I don\'t agree with them... to say Britain has no role in this is quite ridiculous really.&quot;</p>\n',
    createdAt: '2014-09-30T11:28:22Z',
    tags: ['reliable']
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T11:26:44Z',
    tags: [ 'twitter', 'Admiralty' ],
    data: { url: 'https://twitter.com/OCLPHK/status/516911734729093120' }
}, {
    contributor: '01',
    caption: '<p>[7:15] Student leaders Lester Shum and Agnes Chow addressed crowds in Central, thanking all those who joined, saying the turnout was a surprise.\n“We are not only hoping for CY [Leung] to step down but we are also hoping for democratic development in Hong Kong – that we should have civil nomination and universal suffrage,” they said.\nChow, whose long, pink hair was soaked in sweat, urged the public to come out and join the protests to tomorrow, a public holiday and the anniversary of the Communist Party’s founding. Chow said she did not know how long the civil disobedience action would last.\nIn a warning to Hong Kong chief executive Leung, she said: “Where there are hundreds of thousands or even over millions of people coming out, you should respect the opinion of Hong Kong people and step down. Give Hong Kong people a real democratic system with civil nomination.&quot;</p>\n',
    createdAt: '2014-09-30T11:26:22Z',
    tags: ['important', 'reliable']
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T11:25:44Z',
    tags: [ 'twitter', 'CausewayBay', 'Central' ],
    data: { url: 'https://twitter.com/youngposthk/status/516911102311944192' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T11:17:22Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/AgnesBun/status/516909337302679553' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-30T11:11:22Z',
    tags: [ 'twitter', 'Mongkok' ],
    data: { url: 'https://twitter.com/youngposthk/status/516905921339858945' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T10:35:25Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/DimiSevastopulo/status/516896485099585538' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-30T10:05:25Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/youngposthk/status/516889904999972864' }
}, {
    contributor: '01',
    caption: '<p>[5:45] Hong Kong police hold a press conference saying they never meant to “open fire” on protesters on Sunday, when officers unleashed 87 rounds of tear gas.\nPressed on whether police planned to shoot rubber bullets that day, Police Chief Superintendent Steve Hui Chun-tak, from the police public relations bureau, refused to answer directly, only stressing that they “never intended to fire any shots”.\nHui suggested a warning sign held up by officers before they shot tear gas may have caused confusion.\n“The flag has two sides; the side in black says ‘warning: tear smoke’ while the other side says ‘disperse or we fire’,” he said. “We never meant to show [the other side of the flag] to the crowd in the front and we had absolutely no intention to open fire.&quot;\nOnly pepper spray, batons and tear gas were used, he said.</p>\n',
    createdAt: '2014-09-30T10:03:22Z',
    tags: ['reliable', 'important']
}, {
    contributor: '01',
    caption: '<p>[5:59] There are several reports of government supporters going down to the protests to remonstrate with people there.</p>\n',
    createdAt: '2014-09-30T10:01:22Z',
    tags: []
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-30T09:54:55Z',
    tags: [ 'twitter', 'Central' ],
    data: { url: 'https://twitter.com/youngposthk/status/516882423171518464' }
}, {
    contributor: '02',
    caption: '<p>1731 Chan Kin Man: The two demands proposed earlier came from the majority of slogans which protesters chanted: &quot;CY Leung step down&quot; and &quot;we want genuine universal suffrage&quot;.</p>\n',
    createdAt: '2014-09-30T09:32:56Z',
    tags: []
}, {
    contributor: '02',
    caption: '<p>1700 Police and Fire Services press conference ended. OCLP press conference will follow at 1730 hours.</p>\n',
    createdAt: '2014-09-30T09:02:56Z',
    tags: []
}, {
    contributor: '02',
    caption: '<p>1636 Fire Services Department representative claimed emergency services affected by protests.</p>\n',
    createdAt: '2014-09-30T08:37:56Z',
    tags: ['policeConference', 'reliable']
}, {
    contributor: '02',
    caption: '<p>1636 Fire Services Department representative takes turn to speak in the press conference.</p>\n',
    createdAt: '2014-09-30T08:36:56Z',
    tags: ['policeConference', 'reliable']
}, {
    contributor: '02',
    caption: '<p>1633 Police press conference: ~3670 meters of roads blocked in all protest sites.</p>\n',
    createdAt: '2014-09-30T08:34:56Z',
    tags: ['policeConference', 'reliable']
}, {
    contributor: '02',
    caption: '<p>1629 Police representative showing a map of the protests in the press conference.</p>\n',
    createdAt: '2014-09-30T08:29:56Z',
    tags: ['policeConference', 'reliable']
}, {
    contributor: '02',
    caption: '<p>[1615] Press Conference by Police and Fire Service Department starts.</p>\n',
    createdAt: '2014-09-30T08:19:56Z',
    tags: ['policeConference', 'reliable']
}, {
    contributor: '05',
    caption: '<p>Local media are reporting that the police will speak to reporters at 4pm local time. This will be followed by a public statement due to be issued by student activists and Occupy Central at <b>4.30pm.</b></p>\n',
    createdAt: '2014-09-30T08:10:56Z',
    tags: ['important', 'reliable']
}, {
    contributor: '03',
    caption: '<p>The Police Force and Fire Services Department will hold a press conference in 16:00.</p>\n',
    createdAt: '2014-09-30T08:07:56Z',
    tags: ['important']
}, {
    contributor: '06',
    caption: '<p>1559 Gloucester Road, Admiralty.</p>\n',
    createdAt: '2014-09-30T08:05:13Z',
    data: { url: 'http://imgur.com/Oqm4KZW' }
}, {
    contributor: '05',
    caption: '<p>1450, Mongkok. &gt;1000 protesters here</p>\n',
    createdAt: '2014-09-30T07:13:19Z',
    tags: [ 'facebook', 'Mongkok' ],
    data: { url: 'https://www.facebook.com/inmediahk/photos/pcb.748548795182161/748548455182195/' }
}, {
    contributor: '03',
    caption: '<p><strong>Hospital Authority (HA)</strong> clarifies that earlier rumours about a pregnant woman failing to reach hospital on time due to protests were untrue</p>\n',
    createdAt: '2014-09-30T07:05:56Z',
    tags: ['important', 'reliable']
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T06:54:55Z',
    tags: [ 'twitter', 'Admiralty' ],
    data: { url: 'https://twitter.com/OCLPHK/status/516843601406349312' }
}, {
    contributor: '05',
    caption: '<p>1445, Admiralty. Cops nowhere to be seen except outside Chief Executive\'s office.</p>\n',
    createdAt: '2014-09-30T06:47:18Z',
    tags: [ 'facebook', 'Admiralty' ],
    data: { url: 'https://www.facebook.com/dashhk/photos/a.650935051654975.1073741829.430660383682444/701764646572015/' }
}, {
    contributor: '05',
    caption: '<p>1400, First-aid station now urgently need anyone with knowledge on how to perform first-aid.</p>\n',
    createdAt: '2014-09-30T06:10:18Z',
    tags: [ 'facebook', 'Central' ],
    data: { url: 'https://www.facebook.com/928hkbucommunewscenter/posts/715183841863089' }
}, {
    contributor: '02',
    caption: '<p>1328, Nathan Road, Mongkok.</p>\n',
    createdAt: '2014-09-30T06:08:18Z',
    tags: [ 'facebook', 'Mongkok' ],
    data: { url: 'https://www.facebook.com/hk926/photos/a.351496551667942.1073741827.351486368335627/352734098210854/' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T05:06:18Z',
    tags: [ 'twitter', 'CausewayBay', 'Central' ],
    data: { url: 'https://twitter.com/youngposthk/status/516816132808790017' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-30T04:39:18Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/SCMP_News/status/516801065631907841' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-30T04:30:32Z',
    tags: [ 'twitter', 'WanChai' ],
    data: { url: 'https://twitter.com/youngposthk/status/516807076203360256' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-30T03:40:37Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/youngposthk/status/516793275886223360' }
}, {
    contributor: '02',
    caption: '<p>1122, Admiralty. Police blocked Tim Wa Avenue.</p>\n',
    createdAt: '2014-09-30T03:08:18Z',
    tags: [ 'facebook', 'Admiralty' ],
    data: { url: 'https://www.facebook.com/hk926/photos/a.351496551667942.1073741827.351486368335627/352712374879693/' }
}, {
    contributor: '03',
    caption: '',
    createdAt: '2014-09-30T03:13:29Z',
    tags: [ 'twitter', 'Admiralty' ],
    data: { url: 'https://twitter.com/youngposthk/status/516787673885708289' }
}, {
    contributor: '06',
    caption: '<p>Chan Kin Man asked supporters not to bring fresh food for supplies.</p>\n',
    createdAt: '2014-09-30T03:08:18Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/Sanpoyanpage/photos/pcb.305574666310163/305574632976833/' }
}, {
    contributor: '06',
    caption: '<p>1105, Mongkok. ~200 people here.</p>\n',
    createdAt: '2014-09-30T03:08:18Z',
    tags: [ 'facebook', 'Mongkok' ],
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/748487155188325/' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-30T02:34:55Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/OCLPHK/status/516777690783690752' }
}, {
    contributor: '06',
    caption: '<p>1000, about 300 people at Admiralty. Police are starting to form formation. Volunteers need to stop working and move to Admiralty to fill up Admiralty.</p>\n',
    createdAt: '2014-09-30T02:33:26Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/928hkbucommunewscenter/posts/715138295200977' }
}, {
    contributor: '05',
    caption: '<p>Scholarism has once again repeated their four demands on Facebook:</p>\n<ul>\n<li>Establish civil nomination as a valid nomination method for the 2017 Chief Executive Election,</li>\n<li>Start to reform of the Legislative Council (LEGCO), abolish all functional constituency seats of the LEGCO,</li>\n<li>Make an official apology to the Hong Kong people, withdraw the injustice resolution concerning Hong Kong political reform, Or else,</li>\n<li>principal officials responsible for the political reform including CY Leung, Carrie Lam, Rimsky Yuen and Tam Chi-yuen should take the blame and resign.</li>\n</ul>\n',
    createdAt: '2014-09-30T02:25:47Z',
    tags: ['Scholarism', 'important', 'reliable']
}, {
    contributor: '06',
    caption: '<p>(10:06) All exits in Admiralty MTR station have been opened.\nSource: JMSC Reporter Laura Chung</p>\n',
    createdAt: '2014-09-30T02:17:26Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hkverified/photos/641507725967055/' }
}, {
    contributor: '04',
    caption: '<p>1000, Passion Times once again urges people to go to Admiralty to fight against the clearance by the police.</p>\n',
    createdAt: '2014-09-30T02:00:31Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>1000, CY Leung\'s press conference ended.&quot;</p>\n',
    createdAt: '2014-09-30T02:00:31Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>0956, CY Leung said &quot;I treated my election campaign in 2012 like a campaign in a universal sufferage.&quot;</p>\n',
    createdAt: '2014-09-30T01:57:11Z',
    tags: []
}, {
    contributor: '03',
    caption: '<p><09:54> CY is now taking questions from reporters</p>\n',
    createdAt: '2014-09-30T01:55:11Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>CY: We highly value and respect the police\'s professional opinion</p>\n',
    createdAt: '2014-09-30T01:49:11Z',
    tags: ['important', 'reliable']
}, {
    contributor: '05',
    caption: '<p>CY: I, and the government, respect legal methods of expression, incl. political opinions, but hope that they [protestors] watch for their own safety</p>\n',
    createdAt: '2014-09-30T01:46:53Z',
    tags: ['important', 'reliable']
}, {
    contributor: '05',
    caption: '<p><09:41> CY Leung is currently making a statement [TVB]</p>\n',
    createdAt: '2014-09-30T01:42:33Z',
    tags: []
}, {
    contributor: '06',
    caption: '<p>(09:11) Police are still standing guard at the Arsenal Street barrier blocking off the highway. The atmosphere is currently peaceful, with several protesters still present at the scene.\nSource: HKU Student Tong Chiu-Yu, Department of Politics and Public Administration</p>\n',
    createdAt: '2014-09-30T01:38:29Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hkverified/photos/641498585967969/' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-30T01:34:40Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/UmbrellaInfoCen/status/516756411217223680' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-30T01:23:40Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/youngposthk/status/516758022425559040' }
}, {
    contributor: '05',
    caption: '<p>Pro-democracy groups demand unconditional release of student occupiers of CivicSquare. Police hold 3 top leaders for nearly 2 days.\nSource: Occupy Central (Twitter)</p>\n',
    createdAt: '2014-09-30T01:22:41Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>0834, there were only less than a hundred protesters in Causeway Bay, but they are still occupying all car lanes outside SOGO.</p>\n',
    createdAt: '2014-09-30T00:47:41Z',
    tags: ['CausewayBay']
}, {
    contributor: '05',
    caption: '<p>0808, crowds in Mong Kok began to clean up the street.</p>\n',
    createdAt: '2014-09-30T00:10:41Z',
    tags: ['MongKok']
}, {
    contributor: '02',
    caption: '<p>0757, Admiralty MTR station exit A reopen</p>\n',
    createdAt: '2014-09-30T00:02:41Z',
    tags: ['Admiralty']
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-29T23:45:10Z',
    tags: [ 'twitter', 'Admiralty' ],
    data: { url: 'https://twitter.com/fion_li/status/516733012164100098' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-29T23:30:10Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/jackycwong/status/516722321160024064' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T22:55:58Z',
    tags: [ 'twitter', 'MongKok' ],
    data: { url: 'https://twitter.com/hkdemonow/status/516709870976778240' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T21:51:01Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/namelessinchina/status/516705778967666689' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-29T21:41:01Z',
    tags: [ 'twitter', 'MongKok' ],
    data: { url: 'https://twitter.com/BWaiC/status/516702182960144385' }
}, {
    contributor: '06',
    caption: '',
    createdAt: '2014-09-29T20:40:01Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/andrewcnn/status/516687880609992704' }
}, {
    contributor: '03',
    caption: '<p><04:32> CausewayBay. All is calm there</p>\n',
    createdAt: '2014-09-29T20:38:01Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/harbourtimes/status/516686864468545537' }
}, {
    contributor: '02',
    caption: '<p>Scholarism urge resident near Admiralty, Causeway Bay and Mong Kok to join the protest, saying the coming hours are the prime time of police\'s clearance operation.</p>\n',
    createdAt: '2014-09-29T19:53:41Z',
    tags: ['Scholarism']
}, {
    contributor: '06',
    caption: '<p>[02:52] Police officers arrived at Mong Kok car incident scene.</p>\n',
    createdAt: '2014-09-29T19:06:52Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/928hkbucommunewscenter/photos/714992728548867/' }
}, {
    contributor: '05',
    caption: '<p>More coverage on the Mong Kok car incident.</p>\n',
    createdAt: '2014-09-29T18:12:52Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/mingpaoinews/photos/a.498214740238666.1073741826.498203090239831/773050169421787/' }
}, {
    contributor: '05',
    caption: '<p>0201, crowd at Lockhart Road getting prepared for defense.</p>\n',
    createdAt: '2014-09-29T18:06:52Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/posts/748161785220862' }
}, {
    contributor: '03',
    caption: '',
    createdAt: '2014-09-29T18:05:01Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/jasmine_siu/status/516647350597459968' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T17:54:11Z',
    tags: [ 'twitter', 'WanChai' ],
    data: { url: 'https://twitter.com/VivienneChow/status/516647080698212353' }
}, {
    contributor: '06',
    caption: '<p>Birds eyes view of the gathering outside sogo. Sorry for low quality photos. Atmosphere mostly calm. Announcements are made advising what to do in case of police storming and water canons. Moral remains high.</p>\n',
    createdAt: '2014-09-29T17:44:13Z',
    data: { url: 'http://i.imgur.com/4neVabPh.jpg' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T17:22:44Z',
    tags: [ 'twitter', 'CausewayBay' ],
    data: { url: 'https://twitter.com/hkdemonow/status/516638731613126657' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T17:01:44Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/frostyhk/status/516633958000234498' }
}, {
    contributor: '01',
    caption: '<p>FYI the HK police uses flags of different colours to warn protesters.\n        Flags we have seen include:</p>\n<ul>\n<li>\'Yellow flag\': this is an unlawful assembly, please leave (something like that)</li>\n<li>\'Red flag\': stop charging or police will use violence</li>\n<li>\'Black flag\': warning, tear gas</li>\n<li>\'Orange flag\': back down or we\'ll shoot (bullet type not specified)</li>\n</ul>\n',
    createdAt: '2014-09-29T16:45:33Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/frostyhk/status/516629239299207168' }
}, {
    contributor: '03',
    caption: '<p>2335 Protesters surrounded police HQ.</p>\n',
    createdAt: '2014-09-29T16:05:52Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hkfs1958/photos/a.433111302871.207569.269056797871/10152470885812872/' }
}, {
    contributor: '02',
    caption: '<p>2337, Causeway Bay.</p>\n',
    createdAt: '2014-09-29T15:40:55Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/pcb.748080998562274/748080875228953/' }
}, {
    contributor: '06',
    caption: '<p>&quot;Keep off the grass&quot; sign in front of the war memorial, Central</p>\n',
    createdAt: '2014-09-29T15:33:53Z',
    data: { url: 'http://imgur.com/CZTvXmE' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T15:23:20Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/scarychica/status/516604567119609856' }
}, {
    contributor: '02',
    caption: '<p>2250, Central. Despite the crowds around the war memorial in Central, not one person is standing or sitting on the grass. There\'s a new cardboard sign over the usual sign telling people not to go on the grass. (Source: SCMP)</p>\n',
    createdAt: '2014-09-29T15:14:01Z',
    tags: []
}, {
    contributor: '06',
    caption: '<p>2211, Admiralty. Joshua Wong and co thank citizens for their support.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T14:22:58Z',
    data: { url: 'https://www.facebook.com/longhairhk/photos/a.79833563252.78031.10795878252/10152440420878253/' }
}, {
    contributor: '03',
    caption: '<p>[22:12] Police retreated forces in Tamar Park and Civic Square, so citizens are now free to move in and out. The only defense line in the area is at Government HQ.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T14:22:48Z',
    data: { url: 'https://www.facebook.com/928hkbucommunewscenter/posts/714906608557479' }
}, {
    contributor: '03',
    caption: '<p>[22:11] Central.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T14:13:48Z',
    data: { url: 'https://www.facebook.com/VJMediaHK/photos/592555580854572/' }
}, {
    contributor: '01',
    caption: '<p>2200, \'Democracy wall\' in Mong Kok.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T14:09:43Z',
    data: { url: 'https://www.facebook.com/socrec/photos/a.593110604049208.152616.160696287290644/981439565216308/' }
}, {
    contributor: '01',
    caption: '<p>[22:00] Barricades on Nathan Road, Yau Ma Tei.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T14:07:43Z',
    data: { url: 'https://www.facebook.com/socrec/photos/981437805216484/' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T13:59:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/freakingcat/status/516587848506408960' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T13:50:44Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/tomgrundy/status/516584254403129345' }
}, {
    contributor: '05',
    caption: '<p>2146, vans continue to carry necessities to protest areas near Admiralty.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T13:48:13Z',
    data: { url: 'https://www.facebook.com/longhairhk/photos/a.79833563252.78031.10795878252/10152440382173253/' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T13:46:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516584018809077760' }
}, {
    contributor: '04',
    caption: '<p>2134, Causeway Bay.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T13:35:13Z',
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/748012625235778/' }
}, {
    contributor: '01',
    caption: '<p>2130 BMWs help transport necessities.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T13:32:13Z',
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/748012625235778/' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T12:57:33Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516571697726898177' }
}, {
    contributor: '02',
    caption: '<p>1900, The spokesman at Admiralty announced that the police had already set out plans along Arsenal Street, Wan Chai. He urged everyone to be ready for defense at Lippo Centre.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T12:25:13Z',
    data: { url: 'https://www.facebook.com/hkverified/photos/a.640888592695635.1073741829.640622619388899/641195412664953/' }
}, {
    contributor: '06',
    caption: '<p>2017 Police reinforcement spotted at Lung Wo Road, near PLA headquarters, Admiralty. No action reported so far.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T12:23:13Z',
    data: { url: 'https://www.facebook.com/hk926/photos/a.351496551667942.1073741827.351486368335627/352502804900650/' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-29T11:39:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516552761719418880' }
}, {
    contributor: '06',
    caption: '<p>1845, Exit E of Causeway Bay Station blocked.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T11:26:53Z',
    data: { url: 'https://www.facebook.com/passiontimes/photos/a.422169814512858.102977.420361564693683/764862700243566/' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T11:24:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516548650328403968' }
}, {
    contributor: '03',
    caption: '<p>[19:08] Causeway Bay</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T11:14:53Z',
    data: { url: 'https://www.facebook.com/hk926/photos/a.351496551667942.1073741827.351486368335627/352484188235845/?type=1&theater' }
}, {
    contributor: '06',
    caption: '<p>1852, Mong Kok.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T10:52:53Z',
    data: { url: 'https://www.facebook.com/UnitedSocialPress/photos/a.579843072048630.1073741826.579827748716829/831126766920258/' }
}, {
    contributor: '06',
    caption: '<p>1830, Admiralty.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T10:45:53Z',
    data: { url: 'https://www.facebook.com/UnitedSocialPress/photos/a.625319927500944.1073741845.579827748716829/831124213587180/' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T10:03:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/jgriffiths/status/516527526038884353' }
}, {
    contributor: '02',
    caption: '',
    tags: ['youtube'],
    createdAt: '2014-09-29T09:22:55Z',
    data: { url: 'https://www.youtube.com/watch?v=6rBZnr_Lmuk' }
}, {
    contributor: '02',
    caption: '<p>1714 Protesters still blocking exits D, E and F of Causeway Bay Station.</p>\n',
    createdAt: '2014-09-29T09:19:21Z',
    tags: []
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-29T09:17:33Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/BBCBreaking/status/516514059215450113' }
}, {
    contributor: '03',
    caption: '',
    createdAt: '2014-09-29T09:16:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516513296292511744' }
}, {
    contributor: '01',
    caption: '<p>Tomas Wiik has kindly shared his photos of the protest in Flickr. Have a look at them here:</p>\n',
    createdAt: '2014-09-29T09:13:55Z',
    data: { url: 'https://www.flickr.com/photos/tomaswiik/21231011934/' }
}, {
    contributor: '06',
    caption: '<p>More people are flowing into Mong Kok to join the fun after work and school.</p>\n',
    createdAt: '2014-09-29T09:01:21Z',
    tags: []
}, {
    contributor: '06',
    caption: '<p><em>Breaking</em>: Another protest site at Connaught Road Central (outside Statue Square) is being set up.</p>\n',
    tags: ['facebook'],
    createdAt: '2014-09-29T08:50:53Z',
    data: { url: 'https://www.facebook.com/hongkongeconomicjournal/photos/a.141543665886264.18956.139543009419663/900276943346262/?type=1&theater' }
}, {
    contributor: '02',
    caption: '<p>Police still claiming defence lines were heavily charged. And tear gas were the last alternative.</p>\n',
    createdAt: '2014-09-29T08:49:21Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>16:45, Police claimed that protesters were &quot;equipped to impact the policemen.&quot;</p>\n',
    createdAt: '2014-09-29T08:47:53Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>Police: 87 tear gas bombs deployed (in 9 different locations).</p>\n',
    createdAt: '2014-09-29T08:47:33Z',
    tags: []
}, {
    contributor: '02',
    caption: '<p>Police say that they were using pepper spray and tear gas to \'maintain a safe distance\' between protesters and policemen. Also claim repeatedly that protesters were charging against police defense.</p>\n',
    createdAt: '2014-09-29T08:35:33Z',
    tags: []
}, {
    contributor: '06',
    caption: '<p>[16:09] 2000+ gathered in Mong Kok and the occupied area is expanding.</p>\n',
    createdAt: '2014-09-29T08:30:53Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hk926/photos/352447181572879/' }
}, {
    contributor: '05',
    caption: '<p>1619, the police claim that &quot;tear gas&quot; is minimum violence.</p>\n',
    createdAt: '2014-09-29T08:26:33Z',
    tags: []
}, {
    contributor: '01',
    caption: '<p>1612, Initiator of Occupy Central Campaign Chan Kin Man states that the movement has received a first stage victory. And as the campaign has developed into the current stage, the three initiators of the campaign do not have the power to decide when the movement will come to an end.</p>\n',
    createdAt: '2014-09-29T08:21:46Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>Police denounce the \'violent acts\' of protesters and urge protesters to leave peacefully.</p>\n',
    createdAt: '2014-09-29T08:18:46Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>Police said 41 were injured in the past few days, in which 12 were police officers.</p>\n',
    createdAt: '2014-09-29T08:17:41Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>Police claims that they have \'no choice\' other than deploying tear gas.</p>\n',
    createdAt: '2014-09-29T08:16:38Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>[16:00] Protesters set up their barricades near Mandarin Oriental Hotel, Central.</p>\n',
    createdAt: '2014-09-29T08:14:53Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/a.593110604049208.152616.160696287290644/981285261898405/?type=1&theater' }
}, {
    contributor: '04',
    caption: '<p>All eyes on police press conference now. No sign of Chief Police Commissioner Tsang.</p>\n',
    createdAt: '2014-09-29T08:14:38Z',
    tags: []
}, {
    contributor: '04',
    caption: '<p>HSBC notified their staff that they can leave office early if necessary.\nSource: now TV</p>\n',
    createdAt: '2014-09-29T08:13:38Z',
    tags: []
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T08:07:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/AgnesBun/status/516499347769286656' }
}, {
    contributor: '03',
    caption: '',
    createdAt: '2014-09-29T08:06:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/harbourtimes/status/516495471284461568' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-29T08:04:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516497900671496192' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-29T08:03:39Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516497900671496192' }
}, {
    contributor: '01',
    caption: '<p>1550, HKCTU (Hong Kong Confederation of Trade Unions) is having a rally to call for workers to strike.</p>\n',
    createdAt: '2014-09-29T08:02:34Z',
    tags: []
}, {
    contributor: '06',
    caption: '<p>[CUHK] Chinese University of Hong Kong, 1500.</p>\n',
    createdAt: '2014-09-29T07:36:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/pcb.981237111903220/981237098569888/?type=1&theater' }
}, {
    contributor: '06',
    caption: '<p>50,000 people now in Central.</p>\n',
    createdAt: '2014-09-29T07:34:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/passiontimes/photos/a.422169814512858.102977.420361564693683/764761716920331/?type=1&theater' }
}, {
    contributor: '05',
    caption: '<p>1520 More and more people arriving at Admiralty Station.</p>\n',
    createdAt: '2014-09-29T07:30:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hk926/photos/pcb.352437994907131/352437141573883/' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-29T07:27:39Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516487927598047232' }
}, {
    contributor: '03',
    caption: '<p>[Official] Police will meet the press at 4pm.\n(Source: Cable TV News)</p>\n',
    createdAt: '2014-09-29T07:30:33Z',
    tags: []
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T07:25:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516487927598047232' }
}, {
    contributor: '05',
    caption: '<p>[14:35] Citizens continue to transport supplies to the Admiralty site.</p>\n',
    createdAt: '2014-09-29T06:20:23Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/passiontimes/photos/764745286921974/' }
}, {
    contributor: '01',
    caption: '<p>Bottled water supplies in Mong Kok.</p>\n',
    createdAt: '2014-09-29T06:20:23Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/747790835257957/' }
}, {
    contributor: '01',
    caption: '<p>200-strong rally supporting HK protests in LA.</p>\n',
    createdAt: '2014-09-29T06:15:23Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/OCLPHK/photos/a.289787511158449.1073741831.263964720407395/511511878986010/' }
}, {
    contributor: '05',
    caption: '<p>[HKFS] HKFS clarifies that all rumours on them intending to force entry into the LegCo Building are false.</p>\n',
    createdAt: '2014-09-29T06:13:27Z',
    tags: []
}, {
    contributor: '05',
    caption: '<p>[14:03] HKU students at the HKUSU strike meeting decided to invite their Vice-Chancellor, Prof. Peter Mathieson, to meet the students in 24 hours, or they will consider escalate their actions.</p>\n',
    createdAt: '2014-09-29T06:11:27Z',
    tags: []
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T06:08:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/SCMP_News/status/516468383186186240?ref_src=twsrc%5Etfw' }
}, {
    contributor: '01',
    caption: '',
    createdAt: '2014-09-29T06:05:29Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/SCMP_News/status/516468383186186240' }
}, {
    contributor: '01',
    caption: '<p>An overview of today\'s class boycott in secondary schools.</p>\n',
    createdAt: '2014-09-29T05:25:53Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/dashhk/photos/701205439961269/' }
}, {
    contributor: '05',
    caption: '<p>Message from Professor Roland Chin, Provost and Deputy Vice-Chancellor, HKU</p>\n<p>To: All students and staff</p>\n<p>We are continuously monitoring the rapidly changing situation in Hong Kong and will be flexible and understanding as staff and students attempt to continue their professional and personal lives in safety and security.</p>\n<p>As far as practicably possible, the university will adhere to its stated position of &quot;business as usual&quot; but we fully recognise that there are uncertainties facing us all at present. We appeal to all members of the university to remain calm and to maintain high concern for their own safety and that of others.</p>\n<p>Classes will take place as planned and negotiation about re-scheduling of classes is a matter for individual agreements between teachers and students. As far as staff members are concerned, they should make applications for leave in advance according to the normal procedures if they wish to be absent from duty.</p>\n<p>We are fully aware of the chaotic traffic situation in many parts of Hong Kong and Kowloon which may create difficulty for students and staff in coming back to the campus. I am sure teachers and departments will exercise the necessary flexibility for students and staff members who are facing traffic difficulty.</p>\n<p>Professor Roland T Chin Provost and Deputy Vice-Chancellor</p>\n',
    createdAt: '2014-09-29T05:21:14Z',
    tags: ['important']
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T05:17:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516450595624849408' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T05:16:02Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516455309745733632' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-29T05:15:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516455309745733632' }
}, {
    contributor: '05',
    caption: '<p>Press release from the government, specifically the Education Bureau, in response to the announcement by the Professional Teachers\' Union\'s decision to strike.\nOfficial link (it appears that they\'ve edited it since the initial release):\n<a href="http://www.news.gov.hk/en/categories/school_work/html/2014/09/2014">http://www.news.gov.hk/en/categories/school_work/html/2014/09/2014</a></p>\n',
    createdAt: '2014-09-29T05:15:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/tomgrundy/status/516448474292682753' }
}, {
    contributor: '02',
    caption: '<p>25-year-old activist Kenneth staged a one-man protest between 6pm and midnight. He had remained still, facing police at the Legislative Council Complex since the moment tear gas was first deployed.</p>\n',
    createdAt: '2014-09-29T05:21:33Z',
    data: { url: 'http://i.imgur.com/mqB8DpT.jpg' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T05:13:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkdemonow/status/516454219780349953' }
}, {
    contributor: '01',
    caption: '<p>Latest situation in Admiralty</p>\n',
    createdAt: '2014-09-29T05:10:53Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/981134458580152/' }
}, {
    contributor: '06',
    caption: '<p>[HKU] Joint Strike Meeting</p>\n',
    createdAt: '2014-09-29T05:09:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hkucampustv/photos/739671382768227/' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T05:10:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/ChinaRealTime/status/516449995416150016?ref_src=twsrc%5Etfw' }
}, {
    contributor: '03',
    caption: '<p>[SocRec] Numbers are once again growing in Admiralty.</p>\n',
    createdAt: '2014-09-29T05:04:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/a.593110604049208.152616.160696287290644/981134458580152/' }
}, {
    contributor: '02',
    caption: '<p>Cardinal Zen stayed with us at Tim Mei Avenue throughout the night.</p>\n',
    createdAt: '2014-09-29T05:03:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/debbycsw/status/516448362069897216' }
}, {
    contributor: '01',
    caption: '<p>[HKU] HKU student strike meeting sees over 1000 students in black at Sun Yat-sen Plaza.</p>\n',
    createdAt: '2014-09-29T04:59:23Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/undergradnews/photos/a.833105710036487.1073741825.393883453958717/1011434672203589/' }
}, {
    contributor: '05',
    caption: '<p>Raymond Wong Yuk-man at Mong Kok:</p>\n',
    createdAt: '2014-09-29T04:57:28Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/hkchrislau/status/516449778230501376' }
}, {
    contributor: '02',
    caption: '<p>Causeway Bay Exit F</p>\n',
    createdAt: '2014-09-29T04:51:33Z',
    data: { url: 'http://i.imgur.com/uagiVwQ.jpg' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T04:49:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516447220015460353' }
}, {
    contributor: '01',
    caption: '<p>Secondary school students dropping by applauded by protesters.</p>\n',
    createdAt: '2014-09-29T03:33:23Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/a.593110604049208.152616.160696287290644/981091598584438/' }
}, {
    contributor: '03',
    caption: '<p>Striking high school students waving at reporters outside the gate.</p>\n',
    createdAt: '2014-09-29T03:23:13Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/1393187617624530/photos/pcb.1476221459321145/1476218455988112/' }
}, {
    contributor: '02',
    caption: '<p>Student strike meeting in Shue Yan University.</p>\n',
    createdAt: '2014-09-29T03:23:13Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/1393187617624530/photos/pcb.1476221459321145/1476218455988112/' }
}, {
    contributor: '05',
    caption: '<p>~500 protesters gathered in Mong Kok where a number of vehicles stalled on the major road and with barricades set up.</p>\n',
    createdAt: '2014-09-29T02:10:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/981032278590370/' }
}, {
    contributor: '06',
    caption: '<p>Lawmaker Leung Kwok Hung and founder of Next Media (Apple Daily) Jimmy Lai supports protesters outside Admiralty Centre.</p>\n',
    createdAt: '2014-09-29T01:30:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/747631111940596/?type=1&theater' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T00:37:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/george_chen/status/516382578765733889' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-29T00:01:22Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/george_chen/status/516376624133312513' }
}, {
    contributor: '04',
    caption: '<p>MTR service update</p>\n',
    createdAt: '2014-09-28T23:53:31Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/mtrupdate/status/516368476013723649' }
}, {
    contributor: '04',
    caption: '',
    createdAt: '2014-09-28T22:53:31Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/TesaArcilla/status/516359737747599363' }
}, {
    contributor: '02',
    caption: '<p>Legitimately recognised, globally, as a revolution! </p>\n',
    createdAt: '2014-09-28T21:21:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/747546948615679/' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-28T21:00:33Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/OCLPHK/status/516322208403058688' }
}, {
    contributor: '06',
    caption: '<p>London, Trafalgar Sq. at 0359 am HKT in support of HK.</p>\n',
    createdAt: '2014-09-28T20:07:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hk926/photos/a.351496551667942.1073741827.351486368335627/352266331590964/' }
}, {
    contributor: '02',
    caption: '<p>Proesters heading in with motorbikes.</p>\n',
    createdAt: '2014-09-28T20:05:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/a.321611837875861.67317.200954406608272/747526471951060/?type=1&theater' }
}, {
    contributor: '02',
    caption: '<p>Hennessy Road from Admiralty.</p>\n',
    createdAt: '2014-09-28T20:04:33Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/UnitedSocialPress/photos/a.579843072048630.1073741826.579827748716829/830826210283647/?type=1&theater' }
}, {
    contributor: '02',
    caption: '<p>Over 10 police vehicles are surrounding the Bank of China Tower.</p>\n',
    createdAt: '2014-09-28T20:02:42Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/hkverified/photos/a.640710039380157.1073741827.640622619388899/640793166038511/?type=1&theater' }
}, {
    contributor: '02',
    caption: '',
    createdAt: '2014-09-28T19:12:30Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/HKFS1958/status/516301682418782208' }
}, {
    contributor: '05',
    caption: '<p>3000 signatures collected at Fanling station (northern part of HK) in support for the protests in HK island.</p>\n',
    createdAt: '2014-09-28T19:11:50Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/pcb.980844841942447/980844818609116/?type=1&theater' }
}, {
    contributor: '05',
    caption: '<p>Riot police now at Wan Chai.</p>\n',
    createdAt: '2014-09-28T19:04:27Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/inmediahk/photos/pcb.747502491953458/747502021953505/?type=1&theater' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-28T18:06:43Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/jasmine_siu/status/516647350597459968' }
}, {
    contributor: '05',
    caption: '<p>0108, Central. Protesters gather outside Mandarin Oriental Hotel to prepare for next wave of police evacuation.</p>\n',
    createdAt: '2014-09-28T17:15:56Z',
    tags: ['facebook'],
    data: { url: 'https://www.facebook.com/socrec/photos/pcb.981541658539432/981540105206254/' }
}, {
    contributor: '05',
    caption: '',
    createdAt: '2014-09-28T17:13:42Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/varsitycuhk/status/516635838122168320' }
}, {
    contributor: '03',
    caption: '',
    createdAt: '2014-09-28T17:11:42Z',
    tags: ['twitter'],
    data: { url: 'https://twitter.com/OCLPHK/status/516634540693921792' }
}, {
    contributor: '02',
    createdAt: '2014-09-28T17:07:50Z',
    tags: ['twitter'],
    data: { url: 'http://twitter.com/frostyhk/status/516633958000234498' }
}
];
