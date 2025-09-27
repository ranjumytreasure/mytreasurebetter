# Mobile Backend API Implementation - Treasure App

## Overview

This document contains the actual backend implementation of the key mobile API endpoints found in the codebase. These are the server-side implementations that power the mobile app's dashboard functionality.

## API Endpoints Implementation

### 1. Get Subscriber Group Dashboard Details

#### Endpoint: `GET /subscribers/groups/dashboard`

**Implementation:**
```javascript
getSubGrpDashboardDetails = async (req, res) => {
  console.log("GET: /subscribers/groups/dashboard");
  try {
    let { userId } = req.userDetails;
    let { progress } = req.query;

    // Validate progress parameter
    if (progress) {
      progress = progress.toUpperCase();
      if (!["INPROGRESS", "FUTURE", "CLOSED"].includes(progress)) {
        return await responseUtils.failure(
          "Invalid Group Progress",
          400,
          res
        );
      }
    } else {
      progress = "INPROGRESS";
    }

    // Query 1: Get group progress counts
    let query = `
      select
        g.group_progress "groupProgress",
        count(1)
      from
        users u
      inner join group_subscribers gs 
      on
        gs.subscriber_user_id = u.id
      inner join "groups" g 
      on
        g.id = gs.group_id
      where
        u.id = :userId
      group by
        g.group_progress;
    `;
    
    let groupProgressResult = await sql.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    // Process progress counts
    let inProgressCount = 0;
    let futureCount = 0;
    let completedCount = 0;
    
    if (groupProgressResult && groupProgressResult.length) {
      groupProgressResult.forEach(result => {
        const status = result["groupProgress"];
        const count = +result["count"];

        if (status === "INPROGRESS") {
          inProgressCount += count;
        } else if (status === "FUTURE") {
          futureCount += count;
        } else if (status === "CLOSED") {
          completedCount += count;
        }
      });
    }

    // Query 2: Get group details based on progress filter
    query = `
      select
        g.id "groupId",
        g.amount,
        g.is_gov_approved "isGovApproved",
        g.auct_date "firstauctionDate", 
        g.next_auct_date "auctionDate",
        g.group_progress "groupProgress",
        g."type" "groupType",
        u.id "subscriberId",
        g.created_by "userId",
        gs.id "groupSubscriberId"
      from
        users u
      inner join group_subscribers gs 
      on
        gs.subscriber_user_id = u.id
      inner join "groups" g 
      on
        g.id = gs.group_id
      where
        g.group_progress = :progress
        and u.id = :userId
      order by
        g.auct_date desc;
    `;
    
    let groupResult = await sql.query(query, {
      replacements: { userId, progress },
      type: QueryTypes.SELECT,
    });

    let result = {
      groupProgress: {
        inProgressCount,
        futureCount,
        completedCount,
      },
      groupInfo: groupResult,
    };

    return responseUtils.success("Subscriber group details", result, res);
  } catch (error) {
    console.error(error);
    return responseUtils.exception(res);
  }
};
```

**Query Parameters:**
- `progress` (optional): Filter by group progress ("INPROGRESS", "FUTURE", "CLOSED")
- Default: "INPROGRESS"

**Response Structure:**
```javascript
{
  message: "Subscriber group details",
  error: false,
  code: 200,
  results: {
    groupProgress: {
      inProgressCount: number,
      futureCount: number,
      completedCount: number
    },
    groupInfo: [
      {
        groupId: string,
        amount: number,
        isGovApproved: boolean,
        firstauctionDate: string,
        auctionDate: string,
        groupProgress: string,
        groupType: string,
        subscriberId: string,
        userId: string,
        groupSubscriberId: number
      }
    ]
  },
  date: string
}
```

### 2. Get Subscriber Transaction Dashboard (Non-Paginated)

#### Endpoint: `GET /subscribers/group-transactions/dashboard`

**Implementation:**
```javascript
getSubGrpTransDashboardDetails = async (req, res) => {
  console.log("GET: /subscribers/group-transactions/dashboard");
  try {
    let { userId } = req.userDetails;
    
    let query = `
      select
      u."name", 
      r.payment_method,
      r.payment_type,
      r.payment_amount,
      r.payment_status,
      r.created_at,
      'DOWN' "arrow"
    from
      receipts r   
    inner join users u 
    on
      u.id = r.subscriber_id
    where
      u.id = :userId    
    union
    select
      u."name",
      p.payment_method,
      p.payment_type,
      p.payment_amount,
      p.payment_status,
      p.created_at,
      'UP' "arrow"
    from
      payments p
    inner join users u 
    on
      u.id = p.subscriber_id
    where
      u.id = :userId  
    order by
      created_at desc
    limit 10;
    `;
    
    let result = await sql.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    return responseUtils.success(
      "Subscriber group transaction details",
      result,
      res
    );
  } catch (error) {
    console.error(error);
    return responseUtils.exception(res);
  }
};
```

**Response Structure:**
```javascript
{
  message: "Subscriber group transaction details",
  error: false,
  code: 200,
  results: [
    {
      name: string,
      payment_method: string,
      payment_type: string,
      payment_amount: number,
      payment_status: string,
      created_at: string,
      arrow: "UP" | "DOWN"
    }
  ],
  date: string
}
```

### 3. Get Subscriber Transaction Dashboard (Paginated)

#### Endpoint: `GET /subscribers/group-transactions/dashboard` (with pagination)

**Implementation:**
```javascript
getSubGrpTransDashboardDetailsPageable = async (req, res) => {
  try {
    let { userId } = req.userDetails;
    let { page, size } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = page ? (parseInt(page) - 1) * limit : 0;

    // Main query with pagination
    let query = `
      SELECT
      u."name", 
      r.payment_method,
      r.payment_type,
      r.payment_amount,
      r.payment_status,
      r.created_at,
      'DOWN' AS "arrow"
    FROM
      receipts r
       INNER JOIN users u 
      ON u.id = r.subscriber_id
    WHERE
      u.id =:userId        
          UNION
    SELECT
      u."name",
      p.payment_method,
      p.payment_type,
      p.payment_amount,
      p.payment_status,
      p.created_at,
      'UP' AS "arrow"
    FROM
      payments p
       INNER JOIN users u 
      ON u.id = p.subscriber_id
    WHERE
      u.id = :userId 
    ORDER BY
      created_at DESC
    LIMIT :limit OFFSET :offset;
      `;

    let result = await sql.query(query, {
      replacements: { userId, limit, offset },
      type: QueryTypes.SELECT,
    });

    // Count query for pagination
    let countQuery = `
      select
        COUNT(*)::integer as "totalCount"
      from
        (
          SELECT
          u."name", 
          r.payment_method,
          r.payment_type,
          r.payment_amount,
          r.payment_status,
          r.created_at,
          'DOWN' AS "arrow"
        FROM
          receipts r
           INNER JOIN users u 
          ON u.id = r.subscriber_id
        WHERE
          u.id =:userId        
              UNION
        SELECT
          u."name",
          p.payment_method,
          p.payment_type,
          p.payment_amount,
          p.payment_status,
          p.created_at,
          'UP' AS "arrow"
        FROM
          payments p
           INNER JOIN users u 
          ON u.id = p.subscriber_id
        WHERE
          u.id = :userId 
        ORDER BY
          created_at DESC
      ) as subquery;
      `;

    let totalCount = await sql.query(countQuery, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    const totalPages = Math.ceil(totalCount[0].totalCount / limit);

    return responseUtils.success(
      "Subscriber group transaction details",
      {
        totalItems: totalCount[0].totalCount,
        totalPages,
        currentPage: page ? parseInt(page) : 1,
        transactions: result,
      },
      res
    );
  } catch (error) {
    console.error(error);
    return responseUtils.exception(res);
  }
};
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Records per page (default: 10)

**Response Structure:**
```javascript
{
  message: "Subscriber group transaction details",
  error: false,
  code: 200,
  results: {
    totalItems: number,
    totalPages: number,
    currentPage: number,
    transactions: [
      {
        name: string,
        payment_method: string,
        payment_type: string,
        payment_amount: number,
        payment_status: string,
        created_at: string,
        arrow: "UP" | "DOWN"
      }
    ]
  },
  date: string
}
```

### 4. Get Subscriber Group Details by Group ID

#### Endpoint: `GET /subscribers/groups/:id/:grpSubId`

**Implementation:**
```javascript
getSubGroupDetailsByGroupId = async (req, res) => {
  console.log("GET: /subscribers/groups/:id/:grpSubId");
  try {
    let { userId } = req.userDetails;
    let { id, grpSubId } = req.params;
    
    if (!id) {
      return await responseUtils.failure("Invalid group Id", 400, res);
    }
    if (!grpSubId) {
      return await responseUtils.failure("Invalid Subscriber Id", 400, res);
    }

    // Query 1: Get group basic details
    let query = `SELECT
      g.group_name AS "groupName",
      g.amount,
      g."type",
      g.is_gov_approved AS "isGovApproved",
      g.start_date AS "startDate",
      g.end_date AS "endDate",
      g.commission_amount AS "commissionAmount",
      g.commission_type AS "commissionType",
      g.tenure AS "totalGroups",
      (
        CASE 
            WHEN g."type" = 'FIXED' THEN 
                (SELECT COUNT(1) 
                 FROM public.group_accounts ga 
                 WHERE ga.status = 0 
                   AND ga.asked_by IS NOT NULL 
                   AND ga.group_subscriber_id IS NOT NULL 
                   AND ga.group_id = gs.group_id)
            ELSE 
                (SELECT COUNT(1) 
                 FROM public.group_accounts ga 
                 WHERE ga.status = 0 
                   AND ga.group_id = gs.group_id)
        END
    ) AS "groupsCompleted",
      g.auction_status AS "auctionStatus",
  (select id from public.group_accounts ga where ga.status =1 and ga.group_id =gs.group_id) AS "groupAccountId",
      g.next_auct_date  AS "auctionDate",
      g.created_by AS "groupUserId",
      g.id AS "groupId",
      gs.id AS "grpSubscriberId",
   (SELECT case when count(1) >= 1 then 'BIDTAKEN' else 'BIDNOTTAKEN' 
      end AS "bidStatus" FROM public.group_accounts ga WHERE ga.status = 0 AND ga.group_id =gs.group_id
      and ga.group_subscriber_id =gs.id and ga.id is not null) AS "bidStatus"  
  FROM public.group_subscribers gs
  JOIN public."groups" g ON gs.group_id = g.id
  WHERE gs.group_id = :groupId AND gs.id = :grpSubId
  GROUP BY g.id,gs.id`;
    
    let result = await sql.query(query, {
      replacements: { groupId: id, grpSubId: grpSubId },
      type: QueryTypes.SELECT,
    });

    // Query 2: Get group transaction info
    query = `
      select
        ga.auct_date "date",
        ga.asked_amount "auctionAmount",
        ga.commision "commision",         
        ga.auction_profit_amount "profit",
        ga.reserve_amount "reserve",
        ga.customer_due "customerDue",
        ga.type "type",
        ga.sequence_number "sno",
        ga.customer_amount "prizeMoney",
        ga.asked_by,
        CASE 
        WHEN ga.asked_by IS NOT NULL THEN 'completed'
        ELSE 'pending'
    END AS "auctionStatus"
      from
        group_accounts ga
      where ga.status=0 and
        ga.group_id = :groupId order by ga.auct_date asc;`;
    
    let result2 = await sql.query(query, {
      replacements: { groupId: id },
      type: QueryTypes.SELECT,
    });

    // Process receivables
    let receivaleReceiptsList = [];
    let totalDueAmount = 0;
    let totalPaidAmount = 0;

    if (result && result.length) {
      result = result[0];

      let query = `
        SELECT
            r.id,
            r.created_at "createdAt",
            r.receivable_amount "receivableAmount",
            (
                SELECT 
                    jsonb_agg(json_build_object('createdAt', r2.created_at, 'amount', r2.payment_amount)) 
                FROM 
                    receipts r2 
                WHERE 
                    r2.receivable_id = r.id 
                    AND r2.payment_status = 'SUCCESS'
            ) "receiptDetails",
            (
                SELECT 
                    COALESCE(SUM(r2.payment_amount), 0) 
                FROM 
                    receipts r2 
                WHERE 
                    r2.receivable_id = r.id 
                    AND r2.payment_status = 'SUCCESS'
            ) "totalPaid"
        FROM 
            receivables r
        INNER JOIN 
            subscribers s ON s.subscriber_user_id = r.subscriber_id
        INNER JOIN 
            users u ON u.id = s.subscriber_user_id
        WHERE 
            u.id = :userId
            AND r.group_id = :groupId 
            AND r.group_subscriber_id = :grpSubId
        ORDER BY 
            r.created_at DESC`;

      let receivaleReceiptsResult = await sql.query(query, {
        replacements: { userId, groupId: id, grpSubId: grpSubId },
        type: QueryTypes.SELECT,
      });

      for (let receivaleReceiptObj of receivaleReceiptsResult) {
        if (receivaleReceiptObj.receiptDetails && receivaleReceiptObj.receiptDetails.length) {
          for (let payment of receivaleReceiptObj.receiptDetails) {
            receivaleReceiptsList.push({
              date: payment["createdAt"],
              amount: payment["amount"],
              status: "Success",
            });
          }
          totalPaidAmount += receivaleReceiptObj["totalPaid"];
        }
        
        let outstandingDue = receivaleReceiptObj["receivableAmount"] - receivaleReceiptObj["totalPaid"];
        if (outstandingDue > 0) {
          receivaleReceiptsList.push({
            date: receivaleReceiptObj["createdAt"],
            amount: outstandingDue,
            status: "Due",
          });
          totalDueAmount += outstandingDue;
        }
      }

      result["totalDue"] = totalDueAmount;
      if (receivaleReceiptsList && receivaleReceiptsList.length) {
        result["transactionInfo"] = receivaleReceiptsList;
      }
    }

    // Process payables
    let payablePaymentsList = [];
    let totalAdvanceOutstandingAmount = 0;

    query = `
    SELECT
        r.id,
        r.created_at "createdAt",
        r.payable_amount "payableAmount",
        (
            SELECT 
                jsonb_agg(json_build_object('createdAt', p.created_at, 'amount', p.payment_amount)) 
            FROM 
                payments p 
            WHERE 
                p.payable_id = r.id 
                AND p.payment_status = 'SUCCESS'
        ) "paymentDetails",
        (
            SELECT 
                COALESCE(SUM(p.payment_amount), 0) 
            FROM 
                payments p 
            WHERE 
                p.payable_id = r.id 
                AND p.payment_status = 'SUCCESS'
        ) "totalPaid"
    FROM 
        payables r
        INNER JOIN 
            subscribers s ON s.subscriber_user_id = r.subscriber_id
    INNER JOIN 
        users u ON u.id = s.subscriber_user_id
    WHERE 
        u.id =:userId 
        AND r.group_id = :groupId 
        AND r.group_subscriber_id = :grpSubId
    ORDER BY 
        r.created_at DESC`;

    let payablePaymentsResult = await sql.query(query, {
      replacements: { userId, groupId: id, grpSubId: grpSubId },
      type: QueryTypes.SELECT,
    });

    for (let payablePaymentObj of payablePaymentsResult) {
      if (payablePaymentObj.paymentDetails && payablePaymentObj.paymentDetails.length) {
        payablePaymentsList.push({
          date: payablePaymentObj.paymentDetails[0]["createdAt"],
          amount: payablePaymentObj.paymentDetails[0]["amount"],
          status: "Success",
        });
      }
      
      let outstandingDue = payablePaymentObj["payableAmount"] - payablePaymentObj["totalPaid"];
      if (outstandingDue > 0) {
        payablePaymentsList.push({
          date: payablePaymentObj["createdAt"],
          amount: outstandingDue,
          status: "Due",
        });
        totalAdvanceOutstandingAmount += outstandingDue;
      }
    }

    result["totalAdvanceOutstandingAmount"] = totalAdvanceOutstandingAmount;
    if (payablePaymentsList && payablePaymentsList.length) {
      result["outstandingAdvanceTransactionInfo"] = payablePaymentsList;
    }

    // Process group transaction info and profit calculation
    if (result2 && result2.length) {
      const totalProfit = result2
        .filter(grpTransInfo => grpTransInfo.auctionStatus === 'completed')
        .reduce((acc, grpTransInfo) => acc + grpTransInfo.profit, 0);

      result["profit"] = totalProfit;
      result["groupTransactionInfo"] = result2;
    }

    // Calculate total group outstanding (for fixed groups)
    let groupTotalCustomerDue = 0;
    if (result2 && result2.length) {
      groupTotalCustomerDue = result2.reduce((sum, item) => {
        return sum + (item.customerDue || 0);
      }, 0);
    }

    let totalGroupOutstanding = groupTotalCustomerDue - totalPaidAmount;
    result["totalGroupOutstanding"] = totalGroupOutstanding;

    return responseUtils.success("Subscriber group details", result, res);
  } catch (error) {
    console.error(error);
    return responseUtils.exception(res);
  }
};
```

**Path Parameters:**
- `id`: Group ID
- `grpSubId`: Group Subscriber ID

**Response Structure:**
```javascript
{
  message: "Subscriber group details",
  error: false,
  code: 200,
  results: {
    groupName: string,
    amount: number,
    type: string,
    isGovApproved: boolean,
    startDate: string,
    endDate: string,
    commissionAmount: number,
    commissionType: string,
    totalGroups: number,
    groupsCompleted: number,
    auctionStatus: string,
    groupAccountId: string,
    auctionDate: string,
    groupUserId: string,
    groupId: string,
    grpSubscriberId: number,
    bidStatus: "BIDTAKEN" | "BIDNOTTAKEN",
    totalDue: number,
    profit: number,
    totalAdvanceOutstandingAmount: number,
    totalGroupOutstanding: number,
    transactionInfo: [
      {
        date: string,
        amount: number,
        status: "Success" | "Due"
      }
    ],
    groupTransactionInfo: [
      {
        date: string,
        auctionAmount: number,
        commision: string,
        profit: number,
        reserve: string,
        customerDue: number,
        sno: number,
        type: string,
        auctionStatus: "completed" | "pending",
        prizeMoney: string
      }
    ],
    outstandingAdvanceTransactionInfo: [
      {
        date: string,
        amount: number,
        status: "Success" | "Due"
      }
    ]
  },
  date: string
}
```

## Database Schema Insights

### Key Tables Used:
1. **users** - User information
2. **group_subscribers** - Group membership
3. **groups** - Group details
4. **group_accounts** - Group auction accounts
5. **receivables** - Money to be received
6. **receipts** - Payment receipts
7. **payables** - Money to be paid
8. **payments** - Payment records

### Key Relationships:
- Users → Group Subscribers → Groups
- Group Subscribers → Group Accounts (auctions)
- Users → Receivables → Receipts
- Users → Payables → Payments

## Business Logic Notes

1. **Group Progress States**: INPROGRESS, FUTURE, CLOSED
2. **Payment Arrows**: "UP" for payments made, "DOWN" for receipts received
3. **Auction Status**: "completed" when asked_by is not null, "pending" otherwise
4. **Bid Status**: "BIDTAKEN" when user has placed a bid, "BIDNOTTAKEN" otherwise
5. **Fixed vs Regular Groups**: Different logic for counting completed groups
6. **Outstanding Calculations**: Total due minus total paid amounts

This implementation provides comprehensive dashboard functionality for mobile subscribers, including group management, transaction tracking, and financial calculations.
