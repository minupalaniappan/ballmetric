DICTION = Hash.new
DICTION['3PT'] = 'Three pointer'
DICTION['AST'] = 'Assist'
DICTION['ASSIST'] = 'Assist'
DICTION['STEAL'] = 'Steal'
DICTION['STL'] = 'Steal'
DICTION['BLO'] = 'Block'
DICTION['BLOCK'] = 'Block'
DICTION['Jump Shot'.to_sym] = 'Jump Shot'
DICTION['Driving'] = 'To the rim'
DICTION['Floating'] = 'Floater'
DICTION['Running'] = 'Running'
DICTION['Fadeaway'] = 'Fadeaway'
DICTION['MISS'] = 'Missed shot'
DICTION['FOUL'] = 'Foul'
DICTION['Free Throw'.to_sym] = 'Free Throw'
DICTION['FT'] = 'Free Throw'
DICTION['DUNK'] = 'Dunk'
DICTION['Dunk'] = 'Dunk'
DICTION['Traveling'] = 'Traveling turnover'
DICTION['Technical'] = 'Stoppage'
DICTION['Timeout'] = 'Stoppage'
DICTION['SUB'] = 'Stoppage'
DICTION['Tip'] = 'Tipped ball'
DICTION['Lost Ball'.to_sym] = 'Lost Ball Turnover'
DICTION['TO'] = 'Turnover'
DICTION['Turnover'] = 'Turnover'
DICTION['Bad Pass'.to_sym] = 'Bad Pass'
DICTION['Layup'] = 'Layup'
DICTION['Step Back'.to_sym] = 'Step Back'
DICTION['REB'] = 'Rebound'
DICTION['REBOUND'] = 'Rebound'
DICTION['Rebound'] = 'Rebound'
DICTION['FOR'] = 'Stoppage'
DICTION.freeze

DICTION_arr = Array.new
DICTION_arr.push ({type:'3PT', value:'Three pointer'})
DICTION_arr.push ({type:'AST', value:'Assist'})
DICTION_arr.push ({type:'ASSIST', value:'Assist'})
DICTION_arr.push ({type:'STEAL', value:'Steal'})
DICTION_arr.push ({type:'STL', value:'Steal'})
DICTION_arr.push ({type:'BLO', value:'Block'})
DICTION_arr.push ({type:'BLOCK', value:'Block'})
DICTION_arr.push ({type:'Jump Shot', value:'Jump Shot'})
DICTION_arr.push ({type:'Driving', value:'To the rim'})
DICTION_arr.push ({type:'Floating', value:'Floater'})
DICTION_arr.push ({type:'Running', value:'Running'})
DICTION_arr.push ({type:'Fadeaway', value:'Fadeaway'})
DICTION_arr.push ({type:'MISS', value:'Missed shot'})
DICTION_arr.push ({type:'FOUL', value:'Foul'})
DICTION_arr.push ({type:'Free Throw', value:'Free Throw'})
DICTION_arr.push ({type:'FT', value:'Free Throw'})
DICTION_arr.push ({type:'DUNK', value:'Dunk'})
DICTION_arr.push ({type:'Dunk', value:'Dunk'})
DICTION_arr.push ({type:'Traveling', value:'Traveling turnover'})
DICTION_arr.push ({type:'Technical', value:'Stoppage'})
DICTION_arr.push ({type:'Timeout', value:'Stoppage'})
DICTION_arr.push ({type:'SUB', value:'Stoppage'})
DICTION_arr.push ({type:'Tip', value:'Tipped ball'})
DICTION_arr.push ({type:'Lost Ball', value:'Lost Ball Turnover'})
DICTION_arr.push ({type:'TO', value:'Turnover'})
DICTION_arr.push ({type:'Turnover', value:'Turnover'})
DICTION_arr.push ({type:'Bad Pass', value:'Bad Pass'})
DICTION_arr.push ({type:'Layup', value:'Layup'})
DICTION_arr.push ({type:'Step Back', value:'Step Back'})
DICTION_arr.push ({type:'Made', value:'Made'})
DICTION_arr.push ({type:'REB', value:'Rebound'})
DICTION_arr.push ({type:'REBOUND', value:'Rebound'})
DICTION_arr.push ({type:'Rebound', value:'Rebound'})
DICTION_arr.push ({type:'FOR', value:'Stoppage'})

DICTION_arr.freeze

POSITIONS = Hash.new
POSITIONS['PG'] = "Point Guard"
POSITIONS['SG'] = "Shooting Guard"
POSITIONS['SF'] = "Small Forward"
POSITIONS['PF'] = "Power Forward"
POSITIONS['C'] = "Center"

POSITIONS.freeze

TEAMS = Hash.new
TEAMS['ATL'] = "Atlanta Hawks"
TEAMS['BKN'] = "Brooklyn Nets"
TEAMS['BOS'] = "Boston Celtics"
TEAMS['CHA'] = "Charlotte Hornets"
TEAMS['CHI'] = "Chicago Bulls"
TEAMS['CLE'] = "Cleveland Cavaliers"
TEAMS['DAL'] = "Dallas Mavericks"
TEAMS['DEN'] = "Denver Nuggets"
TEAMS['DET'] = "Detroit Pistons"
TEAMS['GSW'] = "Golden State Warriors"
TEAMS['HOU'] = "Houston Rockets"
TEAMS['IND'] = "Indiana Pacers"
TEAMS['LAC'] = "Los Angeles Clippers"
TEAMS['LAL'] = "Los Angeles Lakers"
TEAMS['MEM'] = "Memphis Grizzlies"
TEAMS['MIA'] = "Miami Heat"
TEAMS['MIL'] = "Milwaukee Bucks"
TEAMS['MIN'] = "Minnesota Timberwolves"
TEAMS['NOP'] = "New Orleans Pelicans"
TEAMS['NYK'] = "New York Knicks"
TEAMS['OKC'] = "Oklahoma City Thunder"
TEAMS['ORL'] = "Orlando Magic"
TEAMS['PHI'] = "Philadelphia 76ers"
TEAMS['PHO'] = "Phoenix Suns"
TEAMS['POR'] = "Portland Trail Blazers"
TEAMS['SAC'] = "Sacramento Kings"
TEAMS['SAS'] = "San Antonio Spurs"
TEAMS['TOR'] = "Toronto Raptors"
TEAMS['UTA'] = "Utah Jazz"
TEAMS['WSH'] = "Washington Wizards"


