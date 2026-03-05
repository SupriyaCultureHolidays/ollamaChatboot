// Keywords for instant intent matching (0ms response)
// Maps common words/phrases to intents to avoid Ollama calls

export default {
  // Agent counts and totals
  "get_total_agents": [
    "how many", "total agents", "count agents", "number of agents",
    "total count", "all agents", "agent count", "how many total"
  ],

  // Agents by nationality/country
  "get_agents_by_nationality": [
    "india", "indian", "from india", "nationality india",
    "usa", "america", "american", "from usa", "from america",
    "uk", "england", "british", "from uk", "from england",
    "nationality", "country", "from country", "by nationality"
  ],

  // Inactive agents
  "get_inactive_agents": [
    "inactive", "not logged", "not active", "no login",
    "haven't logged", "never login", "dormant", "not seen",
    "inactive agents", "not logging", "no recent login"
  ],

  // Agent login activity
  "get_agent_last_login": [
    "last login", "last seen", "last active", "when did",
    "login time", "last time", "when last", "latest login"
  ],

  // Recent logins
  "get_recent_logins": [
    "recent login", "who logged in", "logged today", "logged this week",
    "latest login", "new login", "recent activity", "today login"
  ],

  // Agents by company
  "get_agents_by_company": [
    "company", "comp_name", "organisation", "firm",
    "belongs to", "works for", "from company", "company agents"
  ],

  // Agent details/search
  "get_agent_details": [
    "details", "show agent", "find agent", "agent info",
    "search agent", "agent by", "who is", "tell me about"
  ],

  // Pagination commands
  "pagination_next": [
    "next", "show next", "more", "show more", "continue"
  ],

  "pagination_previous": [
    "previous", "prev", "back", "show previous", "go back"
  ]
};