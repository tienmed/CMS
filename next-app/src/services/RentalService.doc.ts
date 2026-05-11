## Rental Service Documentation

This document describes the functionality of the `RentalService` class, which manages rental tickets and equipment rentals.

**Class: `RentalService`**

The `RentalService` class provides a singleton instance for managing rental operations. It encapsulates all logic related to creating, retrieving, and updating rental tickets and equipment details.

**Static Methods:**

* **`getInstance()`: `Singleton Instance`**
   - Returns the single instance of the `RentalService` class.

**Instance Methods:**

* **`getActiveTickets()`: `Get Active Rental Tickets`**
   - Retrieves a list of active rental tickets, excluding those that have been completed.
   - **Logic:**
     - Executes a SQL query to select all rental tickets where `completed_date` is `NULL` (indicating active rentals).
     - Orders the results by `rented_date` in descending order.
   - **Returns:** An array of `RentalTicket` objects representing active rental tickets.
* **`getUsageHistory()`: `Get Detailed Usage History`**
   - Retrieves a comprehensive usage history, grouped by rental ticket, including equipment details.
   - **Logic:**
     - Executes a complex SQL query to join multiple tables (`rental_ticket`, `rental_detail`, `equipment_item`, `equipment`, `equipment_status`, and `department`) to retrieve all necessary information.
     - Groups the results by `rental_ticket.id` to provide a detailed history for each ticket.
     - Returns an array of `UsageHistory` objects, each containing information about a rental ticket and its associated items.
   - **Returns:** An array of `UsageHistory` objects.
* **`generateNextTicketNo()`: `Generate Next Ticket Number`**
   - Generates the next unique rental ticket number in the format `RT-YYYYMMLL`, where `LL` is the sequence number for the current month.
   - **Logic:**
     - Determines the current year and month.
     - Queries the database to find the highest numbered ticket with the same prefix in the current month.
     - Increments the sequence number based on the retrieved ticket number.
   - **Returns:** The next unique rental ticket number as a string.
* **`createRentalTicket(ticket, itemIds)`: `Create New Rental Ticket`**
   - Creates a new rental ticket and associates it with the specified items.
   - **Logic:**
     - Performs database transactions to ensure data integrity.
     - Validates rental eligibility by checking equipment status and conditions.
     - Inserts a new rental ticket record into the database with provided details.
     - Inserts corresponding rental detail records for each item.
     - Updates the equipment items to reflect their rented status.
   - **Returns:** The ID of the newly created rental ticket.
* **`getTicketDetails(ticketId)`: `Retrieve Ticket Details`**
   - Retrieves the details of a specific rental ticket, including associated items.
   - **Logic:**
     - Executes a SQL query to retrieve all data related to the ticket and its items.
     - Constructs an `UsageHistory` object with the retrieved information.
   - **Returns:** An `UsageHistory` object representing the specified rental ticket and its associated items, or `null` if no ticket is found.
* **`returnItems(ticketId, detailIds)`: `Partial Return Items`**
   - Marks specified equipment items as returned for a given rental ticket.
   - **Logic:**
     - Updates the `returned_at` timestamp in the `rental_detail` table for the specified items.
     - Changes the status of the returned items in the `equipment_item` table.
     - Updates the `completed_date` of the rental ticket if all items are returned.
     - Calculates and returns the current session count for the ticket.


**Usage:**

The `rentalService` singleton instance provides access to all of these methods. For example, to get all active rental tickets:

```javascript
const activeTickets = await rentalService.getActiveTickets();
```



