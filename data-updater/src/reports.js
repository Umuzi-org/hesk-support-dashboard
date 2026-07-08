const { query } = require("./database");

const queryScripts = {
  tickets: `SELECT 
    t.id AS "#",
    t.trackid AS "Tracking ID",
    t.dt AS "Date",
    t.lastchange AS "Updated",
    t.name AS "Name",
    t.email AS "Email",
    c.name AS "Category",
    CASE t.priority       
        WHEN '3' THEN 'Low'
        WHEN '2' THEN 'Medium'
        WHEN '1' THEN 'High'
        WHEN '0' THEN 'Critical'
        ELSE 'Unknown'
    END AS "Priority",
    CASE t.status
        WHEN 0 THEN 'New'
        WHEN 1 THEN 'Waiting Reply'
        WHEN 2 THEN 'Replied'
        WHEN 3 THEN 'Resolved'
        WHEN 4 THEN 'In Progress'
        WHEN 5 THEN 'On Hold'
        ELSE 'Unknown'
    END AS "Status",
    t.subject AS "Subject",
    t.message AS "Message",
    u.user AS "Owner",    
    t.time_worked AS "Time worked",
    t.closedat AS "Due date"
	
FROM hesk_tickets t
LEFT JOIN hesk_categories c ON t.category = c.id
LEFT JOIN hesk_users u ON t.owner = u.id
WHERE t.dt >= '2026-01-01';`,
  replyRatings: `SELECT
  r.id      AS reply_id,
  r.replyto AS ticket_id,
  r.name    AS replied_by,
  
  CASE
    WHEN r.staffid <> '0' THEN 'Yes'
    ELSE 'No'
  END AS is_staff,
  
  r.dt      AS replied_at,
  r.rating,

  CASE
    WHEN r.rating = '5' THEN 'Positive'
    WHEN r.rating = '1' THEN 'Negative'
    ELSE ''
  END AS rating_label

FROM hesk_replies r
WHERE r.dt >= '2026-01-01';`,
  agentCsat: `SELECT
  id, user AS username, name, email,
  CASE WHEN isadmin = '1' THEN 'Yes' ELSE 'No' END AS is_admin,
  replies AS total_replies,
  ratingpos AS positive_ratings,
  ratingneg AS negative_ratings,
  ratingpos + ratingneg AS total_rated,
  ROUND(ratingpos / NULLIF(ratingpos + ratingneg, 0) * 100, 1) AS csat_pct,
  rating AS avg_rating_score
FROM hesk_users`,
};

async function runReports() {
  const ticketsReport = await query(queryScripts.tickets);
  const replyRatingsReport = await query(queryScripts.replyRatings);
  const agentCsatReport = await query(queryScripts.agentCsat);

  return { ticketsReport, replyRatingsReport, agentCsatReport };
}

module.exports = { runReports };
