/***********************************************************
 * ADDY SPORT
 * ລະບົບບັນທຶກ ແລະ ກວດສອບຜົນການແຂ່ງຂັນກິລາ
 *
 * INSTALL: Create an Apps Script project with these two files.
 * Run setupSystem() once from the script editor; authorize Sheets,
 * Drive. Deploy as Web app, execute as owner.
 * Update WEB_APP_URL below after making a new deployment.
 * First administrator login: admin + ADMIN_PASSWORD below.
 * Super Admin creates/activates accounts and approves password-reset requests.
 * UPGRADE: Run setupSystem() once to append user-access and result-review fields without deleting data.
 * Never share Code.gs publicly: it contains the administrator password.
 * Sheet columns are managed by this application; do not rename them.
 ***********************************************************/
const SHEET_ID = "1dHOfIHsghPoipQu5ttD_4L7ed8augGQVjzTNaQt0whI";
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwPtWqO1siaAqDo0aqAFobFCJpYhtfXroNImNmTGI9BcMCR49aehZhx1TaxBNxU9D_IPw/exec";
const ADMIN_PASSWORD = "Dy1234";

const APP = {
  title: 'ADDY SPORT',
  timezone: 'Asia/Vientiane',
  sessionSeconds: 21600,
  passwordRounds: 10000,
  schemaVersion: '1.21.0',
  apiVersion: '2026-11-09.48'
};

const SCHEMA = {
  Settings: ['id', 'value', 'updatedAt'],
  Users: ['id', 'name', 'email', 'phone', 'role', 'salt', 'passwordHash', 'verified', 'authVersion',
    'archived', 'createdAt', 'updatedAt', 'accessLevel', 'moduleAccess', 'accountCode', 'disabled', 'tournamentId', 'managedBy'],
  Tokens: ['id', 'userId', 'kind', 'expiresAt', 'used', 'createdAt'],
  PasswordRequests: ['id', 'userId', 'reason', 'status', 'reviewNote', 'reviewedBy', 'reviewedAt',
    'createdAt', 'updatedAt'],
  StandingsAdjustments: ['id','entryId','tournamentId','teamId','group','playedDelta','winsDelta','drawsDelta','lossesDelta','goalsForDelta','goalsAgainstDelta','pointsDelta','reason','revision','updatedBy','archived','createdAt','updatedAt'],
  StatAdjustments: ['id','playerId','teamId','tournamentId','goalsDelta','yellowDelta','redDelta','reason','updatedBy','archived','createdAt','updatedAt'],
  MatchClocks: ['id','elapsedMs','lastStartedAt','running','updatedBy','createdAt','updatedAt'],
  Sports: ['id', 'name', 'category', 'gender', 'type', 'scoringRules', 'notes', 'demo', 'archived',
    'createdAt', 'updatedAt'],
  Tournaments: ['id', 'name', 'sportId', 'format', 'legs', 'groupCount', 'qualifyPerGroup', 'bestExtra',
    'pointsWin', 'pointsDraw', 'pointsLoss', 'tiebreakers', 'tieRule', 'minPlayers', 'maxPlayers',
    'playersOnField', 'allowDuplicate', 'rosterDeadline', 'identityRule', 'managerIds', 'startDate',
    'endDate', 'weekdays', 'dayStart', 'dayEnd', 'duration', 'breakMinutes', 'minRest', 'venues',
    'blackoutDates', 'published', 'schedulePublished', 'demo', 'archived', 'createdAt', 'updatedAt',
    'minAge', 'maxAge', 'ageCutoffDate', 'createdBy'],
  Teams: ['id', 'name', 'school', 'shortName', 'color', 'logoUrl', 'contactName', 'phone', 'coach',
    'ownerId', 'notes', 'demo', 'archived', 'createdAt', 'updatedAt', 'status', 'reviewNote',
    'verificationCode', 'reviewedBy', 'reviewedAt', 'reviewedName', 'evidenceUrl'],
  Entries: ['id', 'tournamentId', 'teamId', 'status', 'reviewNote', 'group', 'seed', 'pot', 'avoidTag',
    'lot', 'demo', 'archived', 'createdAt', 'updatedAt'],
  Players: ['id', 'entryId', 'name', 'identityKey', 'birthDate', 'jersey', 'position', 'photoUrl',
    'verified', 'demo', 'archived', 'createdAt', 'updatedAt', 'identityDocumentUrl', 'certificateUrl', 'status',
    'reviewNote', 'verificationCode', 'notes', 'reviewedBy', 'reviewedName', 'reviewedAt', 'playerCode'],
  PlayerTransfers: ['id', 'playerId', 'playerCode', 'playerName', 'fromEntryId', 'toEntryId',
    'tournamentId', 'requestedBy', 'acceptedBy', 'acceptedAt', 'status', 'reason', 'reviewNote',
    'reviewedBy', 'reviewedAt', 'playerStamp', 'verificationCode', 'archived', 'createdAt', 'updatedAt',
    'initiatorSide', 'acceptedAsStaff', 'acceptedTeamOwnerId', 'acceptedName'],
  RosterRequests: ['id', 'entryId', 'playerId', 'payload', 'status', 'note', 'demo', 'archived',
    'createdAt', 'updatedAt', 'before', 'requestedBy', 'submittedAt', 'verificationCode', 'baseStamp',
    'reviewedBy', 'reviewedAt', 'reason', 'playerCode'],
  Matches: ['id', 'tournamentId', 'sportId', 'phase', 'group', 'round', 'teamA', 'teamB', 'sourceA',
    'sourceB', 'venue', 'startAt', 'duration', 'refereeId', 'status', 'specialOutcome', 'notes', 'demo',
    'archived', 'createdAt', 'updatedAt'],
  Results: ['id', 'matchId', 'scoreA', 'scoreB', 'extraA', 'extraB', 'penaltyA', 'penaltyB', 'winnerId',
    'resultText', 'refereeName', 'evidenceUrl', 'events', 'status', 'verificationCode', 'submittedBy',
    'submittedAt', 'confirmedBy', 'confirmedAt', 'rejectReason', 'demo', 'archived', 'createdAt',
    'updatedAt', 'topScorerA', 'topScorerB', 'notes', 'certifierName', 'reviewerName', 'reviewedBy',
    'reviewedAt', 'topScorerAId', 'topScorerBId', 'cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB'],
  Medals: ['id', 'tournamentId', 'sportId', 'goldTeamId', 'silverTeamId', 'bronzeTeamId', 'status', 'demo',
    'archived', 'createdAt', 'updatedAt'],
  Notifications: ['id', 'userId', 'message', 'read', 'demo', 'createdAt', 'updatedAt'],
  Audit: ['id', 'action', 'entityType', 'entityId', 'details', 'actor', 'createdAt']
};
const READ_CACHE_ = {};
let BOOK_CACHE_ = null;
const JSON_FIELDS = ['scoringRules', 'tiebreakers', 'managerIds', 'weekdays', 'venues', 'blackoutDates',
  'events', 'payload', 'details', 'moduleAccess', 'before'];
const BOOL_FIELDS = ['disabled','running','acceptedAsStaff', 'verified', 'archived', 'demo', 'published', 'schedulePublished',
  'allowDuplicate',
  'used', 'read'];
const NUMBER_FIELDS = ['playedDelta','winsDelta','drawsDelta','lossesDelta','goalsForDelta','goalsAgainstDelta','pointsDelta','elapsedMs','cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB','goalsDelta','yellowDelta','redDelta','minAge', 'maxAge', 'legs', 'groupCount', 'qualifyPerGroup', 'bestExtra', 'pointsWin', 'pointsDraw',
  'pointsLoss', 'minPlayers', 'maxPlayers', 'playersOnField', 'duration', 'breakMinutes', 'minRest', 'seed',
  'pot', 'lot', 'round', 'scoreA', 'scoreB', 'extraA', 'extraB', 'penaltyA', 'penaltyB', 'authVersion'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle(APP.title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * One stable, top-level entry point for the HTML service bridge.
 * Replace BOTH project files and deploy a new version when updating this contract.
 * Only explicitly listed application operations can be dispatched.
 * Each operation still performs its own authorization and locking.
 */
function addyApi(request) {
  assert_(request && request.version === APP.apiVersion,
    'DEPLOYMENT_MISMATCH: Replace Code.gs and index.html together, then deploy a new version.');
  assert_(typeof request.method === 'string' && Array.isArray(request.args), 'Invalid API request.');
  const operations = {
    advanceGroups: advanceGroups,
    approveResult: approveResult,
    deleteSport: deleteSport,
    getDeletionOptions: getDeletionOptions,
    deleteManagedRecord: deleteManagedRecord,
    archiveRecord: archiveRecord,
    autoSchedule: autoSchedule,
    clearDemoData: clearDemoData,
    createBackup: createBackup,
    createDemoData: createDemoData,
    exportData: exportData,
    generateMatches: generateMatches,
    getArchivedData: getArchivedData,
    getBootstrapData: getBootstrapData,
    getDatabaseInfo: getDatabaseInfo,
    getAccountPassword: getAccountPassword,
    login: login,
    logout: logout,
    markNotificationsRead: markNotificationsRead,
    randomizeGroups: randomizeGroups,
    redeemAccountToken: redeemAccountToken,
    registerAccount: registerAccount,
    registerTeam: registerTeam,
    rejectResult: rejectResult,
    requestAccountEmail: requestAccountEmail,
    reviewEntry: reviewEntry,
    getEntryReviewDetails: getEntryReviewDetails,
    submitEntry: submitEntry,
    reviewRosterRequest: reviewRosterRequest,
    getRosterCorrectionOptions: getRosterCorrectionOptions,
    getRosterCorrectionSource: getRosterCorrectionSource,
    submitRosterCorrection: submitRosterCorrection,
    getRosterRequestDetails: getRosterRequestDetails,
    getRosterRequestDocument: getRosterRequestDocument,
    saveDrawEntries: saveDrawEntries,
    saveMatch: saveMatch,
    saveMedalAward: saveMedalAward,
    getTeamRosterSelection: getTeamRosterSelection,
    enrollTeamAthletes: enrollTeamAthletes,
    savePlayer: savePlayer,
    reviewPlayer: reviewPlayer,
    getPlayerDetails: getPlayerDetails,
    getAthleteCompetitions: getAthleteCompetitions,
    getPlayerTransferOptions: getPlayerTransferOptions,
    getIncomingTransferEntries: getIncomingTransferEntries,
    searchTransferAthletes: searchTransferAthletes,
    requestPlayerTransfer: requestPlayerTransfer,
    respondPlayerTransfer: respondPlayerTransfer,
    reviewPlayerTransfer: reviewPlayerTransfer,
    saveSettings: saveSettings,
    saveSport: saveSport,
    saveTeam: saveTeam,
    reviewTeam: reviewTeam,
    getTeamDetails: getTeamDetails,
    saveTournament: saveTournament,
    saveUserRole: saveUserRole,
    saveUserAccess: saveUserAccess,
    createStaffAccount: createStaffAccount,
    getCompetitionAssistants: getCompetitionAssistants,
    createCompetitionAssistant: createCompetitionAssistant,
    setCompetitionAssistantEnabled: setCompetitionAssistantEnabled,
    setAccountEnabled: setAccountEnabled,
    approveUserAccount: approveUserAccount,
    requestPasswordReset: requestPasswordReset,
    reviewPasswordReset: reviewPasswordReset,
    openAdminPasswordRequest: openAdminPasswordRequest,
    getStandingsEditData: getStandingsEditData,
    saveStandingsAdjustment: saveStandingsAdjustment,
    getStatEditOptions: getStatEditOptions,
    savePlayerStats: savePlayerStats,
    controlMatchClock: controlMatchClock,
    getLiveMatchConsole: getLiveMatchConsole,
    addLiveMatchEvent: addLiveMatchEvent,
    updateLiveMatchMetrics: updateLiveMatchMetrics,
    submitResult: submitResult,
    uploadImage: uploadImage,
    uploadPlayerDocument: uploadPlayerDocument,
    getPlayerDocument: getPlayerDocument,
    verifyResultCode: verifyResultCode
  };
  assert_(Object.prototype.hasOwnProperty.call(operations, request.method), 'Unsupported API operation.');
  const data = operations[request.method].apply(null, request.args);
  return {
    version: APP.apiVersion,
    data: data
  };
}

/** Run from the editor to check that this Code.gs was saved and setup is complete. */
function checkInstallation() {
  const info = {
    apiVersion: APP.apiVersion,
    setupComplete: PropertiesService.getScriptProperties().getProperty('SCHEMA_READY') === APP
      .schemaVersion,
    message: 'Use Deploy > Manage deployments > Edit > New version > Deploy after replacing both files.'
  };
  console.log(JSON.stringify(info));
  return info;
}

/** Run only from the Apps Script editor while signed in as the project owner. */
function setupSystem() {
  const active = Session.getActiveUser().getEmail();
  const effective = Session.getEffectiveUser().getEmail();
  assert_(active && active === effective, 'Run setupSystem from the Apps Script editor as the owner.');
  return write_(function() {
    const book = SpreadsheetApp.openById(SHEET_ID);
    Object.keys(SCHEMA).forEach(function(name) {
      let sheet = book.getSheetByName(name);
      if (!sheet) sheet = book.insertSheet(name);
      const headers = SCHEMA[name];
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setBackground('#12362c').setFontColor('#ffffff')
          .setFontWeight('bold');
      } else {
        const actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
        if (JSON.stringify(actual) !== JSON.stringify(headers)) {
          // Known upgrades append Results review fields and Users accessLevel.
          // Preserve every existing row and refuse unrelated header changes.
          const legacyCount = name === 'Tournaments' ? headers.indexOf('minAge') : name === 'PlayerTransfers' ? headers.indexOf('initiatorSide') : name ===
            'RosterRequests' ? headers.indexOf('before') : name ===
            'Players' ? headers.indexOf('identityDocumentUrl') : name ===
            'Teams' ? headers.indexOf('status') : name === 'Users' ?
            headers.indexOf('accessLevel') : headers.indexOf(
              'topScorerA');
          const canAppend = ['Tournaments', 'Results', 'Users', 'Teams', 'Players', 'RosterRequests',
              'PlayerTransfers'].indexOf(
              name) >= 0 &&
            legacyCount > 0 &&
            actual.slice(0, legacyCount).every(function(value, i) {
              return value === headers[i];
            }) &&
            actual.slice(legacyCount).every(function(value, i) {
              return value === '' || value === headers[legacyCount + i];
            });
          assert_(canAppend, 'Unexpected schema in ' + name +
            '. Restore the original headers before upgrading.');
          sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
          delete READ_CACHE_[name];
        }
      }
      sheet.setFrozenRows(1);
    });
    const properties = PropertiesService.getScriptProperties();
    if (!properties.getProperty('UPLOAD_FOLDER_ID')) {
      properties.setProperty('UPLOAD_FOLDER_ID', DriveApp.createFolder('ADDY SPORT uploads').getId());
    }
    if (!rows_('Users').some(function(u) {
        return u.id === 'ADMIN';
      })) {
      put_('Users', {
        id: 'ADMIN',
        name: 'Dy',
        email: effective.toLowerCase(),
        phone: '',
        role: 'admin',
        verified: true,
        authVersion: 1
      });
    }
    if (!rows_('Settings').length) {
      put_('Settings', {
        id: 'brandName',
        value: APP.title
      });
      put_('Settings', {
        id: 'accent',
        value: '#14a578'
      });
    }
    rows_('Users').forEach(function(user) {
      if (!user.accountCode) { ensureAccountCode_(user); put_('Users',user,true); }
    });
    rows_('Players').forEach(function(player) {
      if (!player.playerCode) {
        ensurePlayerCode_(player);
        put_('Players', player, true);
      }
    });
    properties.setProperty('SCHEMA_READY', APP.schemaVersion);
    audit_('setup', 'System', APP.schemaVersion, {
      sheetId: SHEET_ID
    }, 'OWNER');
    return {
      ok: true,
      message: 'Setup complete. Login: admin',
      url: WEB_APP_URL
    };
  });
}

function checkAdminPassword(password) {
  // This public endpoint is rate limited as well as the main login endpoint.
  rate_('admin-password-check', 8, 900);
  const valid = String(password || '') === String(ADMIN_PASSWORD);
  if (valid) CacheService.getScriptCache().remove('rate:admin-password-check');
  return valid;
}

/** Self-registration is disabled: all accounts are created by Super Admin. */
function registerAccount() {
  throw new Error('Account creation is managed by Super Admin.');
}

function login(identifier, password) {
  ready_();
  return write_(function() {
    const key = normalize_(identifier);
    rate_('login:' + key, 8, 900);
    const user = rows_('Users').find(function(u) {
      return !u.archived && ((u.id === 'ADMIN' && key === 'admin') || normalize_(u.accountCode || '') === key || u.email === key || (u.phone && u
        .phone === phone_(identifier)));
    });
    const valid = user && (user.id === 'ADMIN' ? checkAdminPassword(password) : passwordHash_(String(
      password), user.salt) === user.passwordHash);
    assert_(valid, 'Invalid login or password.');
    assert_(!user.disabled,'ACCOUNT_DISABLED: ບັນຊີຖືກປິດການໃຊ້ງານ. ກະລຸນາຕິດຕໍ່ຜູ້ດູແລ.');
    assert_(user.verified, 'Account awaiting Super Admin approval.');
    assert_(accessLevel_(user) !== 'none', 'ACCESS_DENIED: Super Admin has not granted access.');
    CacheService.getScriptCache().remove('rate:login:' + key);
    const token = id_() + id_();
    CacheService.getScriptCache().put('session:' + digest_(token), JSON.stringify({
      id: user.id,
      version: user.authVersion,
      adminKey: user.id === 'ADMIN' ? digest_(ADMIN_PASSWORD) : ''
    }), APP.sessionSeconds);
    return {
      token: token,
      user: safeUser_(user),
      expiresIn: APP.sessionSeconds
    };
  });
}

function logout(token) {
  CacheService.getScriptCache().remove('session:' + digest_(String(token || '')));
  return {
    ok: true
  };
}

/** Legacy email recovery is intentionally disabled, including existing reset links. */
function requestAccountEmail() {
  throw new Error('Please submit a password-reset request for Super Admin approval.');
}

function redeemAccountToken() {
  throw new Error('Email reset/verification links are no longer supported. Contact Super Admin.');
}

function ensureAccountCode_(user) {
  if (user.accountCode) return;
  const highest = rows_('Users').reduce(function(max,u) {
    const match = String(u.accountCode || '').match(/^DY(\d{4,})$/);
    return match ? Math.max(max,Number(match[1])) : max;
  },0);
  const properties = PropertiesService.getScriptProperties();
  const next = Math.max(highest,Number(properties.getProperty('ACCOUNT_CODE_SEQUENCE') || 0)) + 1;
  user.accountCode = 'DY' + String(next).padStart(4,'0');
  properties.setProperty('ACCOUNT_CODE_SEQUENCE',String(next));
}

function setAccountEnabled(token,data) {
  return write_(function() {
    const actor = auth_(token,false,'users'), user = get_('Users',data.id);
    assert_(competitionAdmin_(actor),'Only Super Admin or Admin staff can change account status.');
    assert_(typeof data.enabled === 'boolean','Invalid account status.');
    assert_(user.id !== actor.id && user.id !== 'ADMIN' && user.role !== 'admin' && !user.archived,'ບໍ່ສາມາດປ່ຽນສະຖານະບັນຊີຕົນເອງ ຫຼື Super Admin.');
    assert_(actor.role === 'admin' || user.role !== 'operator','Only Super Admin can change Admin staff status.');
    assert_(!data.enabled || user.verified,'ຕ້ອງໃຫ້ Super Admin ອະນຸມັດບັນຊີກ່ອນ.');
    const reason = required_(data.reason,1000), before = !user.disabled;
    user.disabled = !data.enabled;
    user.authVersion = Number(user.authVersion || 0) + 1;
    put_('Users',user);
    audit_('account-status','Users',user.id,{before:before,enabled:data.enabled,reason:reason,accountCode:user.accountCode},actor.id);
    notify_(user.id,data.enabled ? 'Account enabled. Please login again.' : 'Account disabled: '+reason);
    return {ok:true};
  });
}

function approveUserAccount(token, userId) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const user = get_('Users', userId);
    assert_(user.id !== 'ADMIN' && !user.archived, 'Account unavailable.');
    assert_(!user.verified, 'Account already approved.');
    user.verified = true;
    user.authVersion = Number(user.authVersion || 0) + 1;
    put_('Users', user);
    audit_('approve-account', 'Users', user.id, {
      approvedBy: actor.id
    }, actor.id);
    notify_(user.id, 'Account approved by Super Admin.');
    return {
      ok: true
    };
  });
}

/** Public request intake. Never accepts a replacement password or activates an account. */
function requestPasswordReset(data) {
  ready_();
  return write_(function() {
    const identifier = normalize_(required_(data && data.identifier, 254));
    const reason = required_(data.reason, 1000);
    rate_('password-request:' + digest_(identifier), 3, 3600);
    const user = rows_('Users').find(function(u) {
      return u.id !== 'ADMIN' && !u.archived &&
        (normalize_(u.accountCode || '') === identifier || u.email === identifier || (u.phone && u.phone === phone_(identifier)));
    });
    // The same response for unknown, archived, ADMIN and valid accounts avoids enumeration.
    if (user) {
      const pending = rows_('PasswordRequests').some(function(r) {
        return r.userId === user.id && r.status === 'pending';
      });
      if (!pending) {
        const request = {
          userId: user.id,
          reason: reason,
          status: 'pending'
        };
        put_('PasswordRequests', request);
        notify_('ADMIN', 'Password reset requested: ' + user.name + ' (' + user.email + ')');
        audit_('request-password-reset', 'PasswordRequests', request.id, {
          userId: user.id,
          source: 'public-request'
        }, 'PUBLIC');
      }
    }
    return {
      ok: true
    };
  });
}

/** Admin can open the same approval workflow directly from a user row. */
function openAdminPasswordRequest(token, userId, reason) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const user = get_('Users', userId);
    assert_(user.id !== 'ADMIN' && !user.archived, 'Account unavailable.');
    const pending = rows_('PasswordRequests').find(function(r) {
      return r.userId === user.id && r.status === 'pending';
    });
    if (pending) return {
      ok: true,
      id: pending.id
    };
    const request = {
      userId: user.id,
      reason: required_(reason, 1000),
      status: 'pending'
    };
    put_('PasswordRequests', request);
    audit_('admin-open-password-request', 'PasswordRequests', request.id, {
      userId: user.id,
      source: 'admin-user-row'
    }, actor.id);
    return {
      ok: true,
      id: request.id
    };
  });
}

/** Admin checks the requester, then explicitly sets a new password or rejects the request. */
function reviewPasswordReset(token, data) {
  return write_(function() {
    const actor = auth_(token, false, 'passwordRequests');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const request = get_('PasswordRequests', data.id);
    assert_(request.status === 'pending', 'Request already reviewed.');
    assert_(['approved', 'rejected'].indexOf(data.status) >= 0, 'Invalid review status.');
    const user = get_('Users', request.userId);
    assert_(user.id !== 'ADMIN' && !user.archived, 'Account unavailable.');
    const note = data.status === 'rejected' ? required_(data.reviewNote, 1000) : String(data.reviewNote ||
      '').trim().slice(0, 1000);
    if (data.status === 'approved') {
      assert_(data.identityConfirmed === true, 'Confirm the requester identity before approving.');
      const password = password_(data.password);
      assert_(!user.salt || passwordHash_(password, user.salt) !== user.passwordHash,
        'Choose a new password.');
      const salt = id_();
      const hash = passwordHash_(password, salt);
      user.salt = salt;
      user.passwordHash = hash;
      user.authVersion = Number(user.authVersion || 0) + 1;
      user.verified = true;
      storeAccountPassword_(user, password);
      put_('Users', user);
      // Revoke all legacy reset tokens as well as existing sessions (via authVersion).
      rows_('Tokens').filter(function(t) {
        return t.userId === user.id && !t.used;
      }).forEach(function(t) {
        put_('Tokens', Object.assign(t, {
          used: true
        }));
      });
    }
    request.status = data.status;
    request.reviewNote = note;
    request.reviewedBy = actor.id;
    request.reviewedAt = now_();
    put_('PasswordRequests', request);
    notify_(user.id, 'Password reset ' + data.status + ' by Super Admin. ' + note);
    audit_('review-password-reset', 'PasswordRequests', request.id, {
      userId: user.id,
      status: request.status,
      reviewNote: note,
      identityConfirmed: data.identityConfirmed === true
    }, actor.id);
    return {
      ok: true
    };
  });
}

/** Super Admin creates staff accounts directly; no invitation email is sent. */
function createStaffAccount(token, data) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    assert_(data && ['operator', 'captain', 'manager', 'referee'].indexOf(data.role) >= 0,
      'Choose Admin, team captain, tournament manager or result referee.');
    const name = required_(data.name, 100);
    const email = email_(data.email);
    const phone = phone_(data.phone);
    assert_(!phone || /^\+?\d{7,15}$/.test(phone), 'Invalid phone number.');
    const password = password_(data.password);
    const existing = rows_('Users');
    assert_(!existing.some(function(user) {
      return normalize_(user.email) === email || (phone && user.phone === phone);
    }), 'Email or phone already registered. Edit the existing user instead.');
    const salt = id_();
    const user = {
      id: id_(),
      name: name,
      email: email,
      phone: phone,
      role: data.role,
      salt: salt,
      passwordHash: passwordHash_(password, salt),
      verified: true,
      authVersion: 1,
      archived: false,
      accessLevel: data.accessLevel || 'edit',
      moduleAccess: {}
    };
    assert_(['none', 'view', 'edit'].indexOf(user.accessLevel) >= 0, 'Invalid access level.');
    // Administrator approval activates this account. Client flags cannot set privileges.
    storeAccountPassword_(user, password);
    put_('Users', user);
    audit_('create-staff', 'Users', user.id, {
      name: user.name,
      email: user.email,
      role: user.role,
      approvedBy: actor.id
    }, actor.id);
    return {
      ok: true,
      id: user.id,
      user: safeUser_(user)
    };
  });
}

function assistantOwner_(token,tournamentId,readOnly) {
  const actor=auth_(token,readOnly,'tournaments'),tournament=get_('Tournaments',tournamentId);
  assert_(!tournament.archived && (competitionAdmin_(actor) || (actor.role === 'manager' && tournament.createdBy === actor.id)),'Only the competition creator or system Admin may manage its assistants.');
  return {actor:actor,tournament:tournament};
}
function getCompetitionAssistants(token,tournamentId) {
  const scope=assistantOwner_(token,tournamentId,true);
  return {tournamentId:tournamentId,tournamentName:scope.tournament.name,users:active_('Users').filter(u=>u.role === 'assistant' && u.tournamentId === tournamentId).map(safeUser_)};
}
function createCompetitionAssistant(token,data) {
  return write_(function() {
    const scope=assistantOwner_(token,data.tournamentId,false),name=required_(data.name,100),email=email_(data.email),phone=phone_(data.phone),password=password_(data.password);
    assert_(String(data.confirmPassword || '') === password,'Passwords do not match.');
    assert_(!phone || /^\+?\d{7,15}$/.test(phone),'Invalid phone number.');
    assert_(!rows_('Users').some(user=>normalize_(user.email) === email || (phone && user.phone === phone)),'Email or phone already registered.');
    const salt=id_(),user={id:id_(),name:name,email:email,phone:phone,role:'assistant',tournamentId:scope.tournament.id,managedBy:scope.actor.id,salt:salt,passwordHash:passwordHash_(password,salt),verified:true,disabled:false,authVersion:1,archived:false,accessLevel:'edit',moduleAccess:{tournaments:'view',entries:'edit',players:'edit',rosterRequests:'edit',matches:'edit',results:'edit',resultApprovals:'edit',notifications:'edit'}};
    storeAccountPassword_(user,password);put_('Users',user);
    audit_('create-competition-assistant','Users',user.id,{tournamentId:scope.tournament.id,managedBy:scope.actor.id,accountCode:user.accountCode},scope.actor.id);
    return {ok:true,user:safeUser_(user)};
  });
}
function setCompetitionAssistantEnabled(token,data) {
  return write_(function() {
    const scope=assistantOwner_(token,data.tournamentId,false),user=get_('Users',data.id);
    assert_(user.role === 'assistant' && user.tournamentId === scope.tournament.id && !user.archived,'Assistant is not assigned to this competition.');
    assert_(typeof data.enabled === 'boolean','Invalid account status.');
    const reason=required_(data.reason,1000);user.disabled=!data.enabled;user.authVersion=Number(user.authVersion || 0)+1;put_('Users',user);
    audit_('competition-assistant-status','Users',user.id,{tournamentId:scope.tournament.id,enabled:data.enabled,reason:reason},scope.actor.id);
    return {ok:true};
  });
}

/**
 * Explicitly requested recoverable-password feature. Values are kept in Script
 * Properties, separate from Sheets, and are never included in bootstrap or exports.
 * Script project editors can also read Script Properties. This is not encryption.
 */
function storeAccountPassword_(user, password) {
  PropertiesService.getScriptProperties().setProperty(
    'ACCOUNT_PASSWORD:' + SHEET_ID + ':' + user.id,
    JSON.stringify({
      password: password,
      hash: user.passwordHash
    }));
}

/** Only an authenticated Super Admin may reveal a current account password. */
function getAccountPassword(token, userId) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const user = get_('Users', userId);
    assert_(!user.archived, 'Account unavailable.');
    let password = null;
    if (user.id === 'ADMIN') {
      password = String(ADMIN_PASSWORD);
    } else {
      const raw = PropertiesService.getScriptProperties().getProperty(
        'ACCOUNT_PASSWORD:' + SHEET_ID + ':' + user.id);
      if (raw) {
        const record = JSON.parse(raw);
        // An old spreadsheet backup or external credential update must never reveal
        // a password that no longer matches the current account.
        if (record.hash === user.passwordHash && typeof record.password === 'string') {
          password = record.password;
        }
      }
    }
    audit_('view-account-password', 'Users', user.id, {
      available: password !== null
    }, actor.id);
    return {
      available: password !== null,
      password: password
    };
  });
}

/** Super Admin controls the read/edit ceiling; role-based scope remains in effect. */
function saveUserAccess(token, data) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const user = get_('Users', data.id);
    assert_(user.id !== 'ADMIN' && user.role !== 'admin' && !user.archived,
      'Super Admin access cannot be restricted.');
    assert_(['none', 'view', 'edit'].indexOf(data.accessLevel) >= 0, 'Invalid access level.');
    const before = accessLevel_(user);
    const beforeModules = user.moduleAccess || {};
    user.accessLevel = data.accessLevel;
    if (Object.prototype.hasOwnProperty.call(data, 'moduleAccess')) {
      user.moduleAccess = validateModuleAccess_(user, data.moduleAccess);
    }
    user.authVersion = Number(user.authVersion || 0) + 1;
    put_('Users', user);
    audit_('change-access', 'Users', user.id, {
      before: before,
      after: user.accessLevel,
      beforeModules: beforeModules,
      moduleAccess: user.moduleAccess || {}
    }, actor.id);
    notify_(user.id, 'Access updated by Super Admin: ' + user.accessLevel + '. Please login again.');
    return {
      ok: true
    };
  });
}

function saveUserRole(token, data) {
  return write_(function() {
    const actor = auth_(token, false, 'users');
    assert_(actor.role === 'admin', 'Super Admin only.');
    const user = get_('Users', data.id);
    assert_(user.id !== 'ADMIN', 'The initial Super Admin cannot be changed here.');
    assert_(['operator', 'manager', 'captain', 'referee'].indexOf(data.role) !== -1 || (user.role === 'assistant' && data.role === 'assistant'), 'Invalid role.');
    user.role = data.role;
    user.authVersion = Number(user.authVersion || 0) + 1;
    put_('Users', user);
    audit_('role', 'Users', user.id, {
      role: user.role
    }, actor.id);
    return {
      ok: true
    };
  });
}

function getPublicData() {
  ready_();
  const tournaments = active_('Tournaments').filter(function(t) {
    return t.published;
  });
  const tournamentIds = tournaments.map(function(t) {
    return t.id;
  });
  const entries = active_('Entries').filter(function(e) {
    return tournamentIds.indexOf(e.tournamentId) >= 0 && e.status === 'approved';
  });
  const teamIds = entries.map(function(e) {
    return e.teamId;
  });
  const matches = active_('Matches').filter(function(m) {
    const t = tournaments.find(function(item) {
      return item.id === m.tournamentId;
    });
    return t && t.schedulePublished;
  });
  const matchIds = matches.map(function(m) {
    return m.id;
  });
  const results = active_('Results').filter(function(r) {
    return r.status === 'approved' && matchIds.indexOf(r.matchId) >= 0;
  }).map(publicResult_);
  return {
    settings: publicSettings_(),
    webAppUrl: WEB_APP_URL,
    sports: active_('Sports'),
    tournaments: tournaments.map(publicTournament_),
    teams: active_('Teams').filter(function(t) {
      return teamIds.indexOf(t.id) >= 0;
    }).map(publicTeam_),
    entries: entries.map(publicEntry_),
    players: active_('Players').filter(function(p) {
      return (!p.status || p.status === 'approved') && entries.some(function(e) {
        return e.id === p.entryId;
      });
    }).map(publicPlayer_),
    matches: matches.map(publicMatch_),
    results: results,
    medals: active_('Medals').filter(function(m) {
      return m.status === 'approved' && tournamentIds.indexOf(m.tournamentId) >= 0;
    }),
    standings: publicStandings_(tournaments, entries, matches, results),
    liveResults: active_('Results').filter(r => r.status === 'live' && matchIds.indexOf(r.matchId) >= 0).map(r => pick_(r,['id','matchId','scoreA','scoreB','extraA','extraB','events','status','resultText','updatedAt','cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB'])),
    stats: playerStats_(entries, matches, results)
  };
}

function getBootstrapData(token) {
  const publicData = getPublicData();
  if (!token) return {
    publicData: publicData,
    user: null
  };
  const user = auth_(token, true);
  const allEntries = active_('Entries');
  const assigned = active_('Matches').filter(function(m) {
    return m.refereeId === user.id;
  });
  const tournaments = active_('Tournaments').filter(function(t) {
    return (!['manager','assistant'].includes(user.role) && (competitionAdmin_(user) || t.published)) || manages_(user, t) || assigned.some(function(m) {
      return m.tournamentId === t.id;
    });
  });
  const allowedTournaments = tournaments.filter(function(t) {
    return manages_(user, t);
  }).map(function(t) {
    return t.id;
  });
  const teams = active_('Teams').filter(function(team) {
    return competitionAdmin_(user) || team.ownerId === user.id || allEntries.some(function(e) {
      return e.teamId === team.id && allowedTournaments.indexOf(e.tournamentId) >= 0;
    }) || assigned.some(function(m) {
      return [m.teamA, m.teamB].indexOf(team.id) >= 0;
    });
  });
  const teamIds = teams.map(function(t) {
    return t.id;
  });
  const entries = allEntries.filter(function(e) {
    return teams.some(function(team) {
      return team.id === e.teamId && owns_(user, team);
    }) || allowedTournaments.indexOf(e.tournamentId) >= 0 || assigned.some(function(m) {
      return m.tournamentId === e.tournamentId && [m.teamA, m.teamB].indexOf(e.teamId) >= 0;
    });
  });
  const entryIds = entries.map(function(e) {
    return e.id;
  });
  const matches = active_('Matches').filter(function(m) {
    return allowedTournaments.indexOf(m.tournamentId) >= 0 || m.refereeId === user.id;
  });
  const matchIds = matches.map(function(m) {
    return m.id;
  });
  const staff = competitionAdmin_(user) || user.role === 'manager';
  const payload = {
    publicData: publicData,
    user: safeUser_(user),
    privateData: {
      standings: competitionAdmin_(user) ? publicStandings_(tournaments,entries.filter(e => e.status === 'approved'),matches,active_('Results')) : {},
      sports: active_('Sports'),
      tournaments: tournaments,
      teams: user.role === 'referee' ? teams.map(publicTeam_) : teams,
      entries: entries,
      players: active_('Players').filter(function(p) {
        return entryIds.indexOf(p.entryId) >= 0;
      }).map(function(p) {
        return user.role === 'referee' ? publicPlayer_(p) : p;
      }),
      playerTransfers: active_('PlayerTransfers').filter(function(r) {
        return competitionAdmin_(user) || get_('Teams', get_('Entries', r.fromEntryId).teamId)
          .ownerId === user.id || get_('Teams', get_('Entries', r.toEntryId).teamId).ownerId === user
          .id;
      }).map(function(r) {
        return Object.assign({}, r, {
          fromTeamName: get_('Teams', get_('Entries', r.fromEntryId).teamId).name,
          toTeamName: get_('Teams', get_('Entries', r.toEntryId).teamId).name,
          canAccept: (r.initiatorSide === 'receiving' && competitionAdmin_(user)) || get_('Teams',
            get_('Entries', r.initiatorSide === 'receiving' ? r.fromEntryId :
              r.toEntryId).teamId).ownerId === user.id
        });
      }),
      rosterRequests: active_('RosterRequests').filter(function(r) {
        return entryIds.indexOf(r.entryId) >= 0;
      }),
      matches: matches,
      results: active_('Results').filter(function(r) {
        return matchIds.indexOf(r.matchId) >= 0;
      }),
      medals: active_('Medals').filter(function(m) {
        return allowedTournaments.indexOf(m.tournamentId) >= 0;
      }),
      users: staff ? active_('Users').map(safeUser_) : [],
      passwordRequests: user.role === 'admin' ? rows_('PasswordRequests').slice().reverse() : [],
      notifications: rows_('Notifications').filter(function(n) {
        return n.userId === user.id;
      }).slice(-100).reverse(),
      audit: user.role === 'admin' ? rows_('Audit').slice(-150).reverse() : [],
      settings: publicSettings_()
    }
  };
  return filterPrivateModules_(payload, user);
}

function filterPrivateModules_(payload, user) {
  const data = payload.privateData;

  function allowed(key) {
    return moduleAccess_(user, key) !== 'none';
  }
  if (!allowed('results')) data.standings = {};
  if (!allowed('players')) data.playerTransfers = [];
  const resultLookup = allowed('results') || allowed('resultApprovals');
  const rosterLookup = allowed('players') || allowed('rosterRequests');
  const fixtureLookup = allowed('matches') || resultLookup;
  const entryLookup = allowed('entries') || rosterLookup || fixtureLookup;
  if (!allowed('results')) data.results = allowed('resultApprovals') ? data.results.filter(function(r) {
    return r.status === 'pending';
  }) : [];
  if (!allowed('matches')) data.matches = resultLookup ? data.matches.map(function(m) {
    return Object.assign(publicMatch_(m), {
      refereeId: m.refereeId
    });
  }) : [];
  if (!allowed('entries')) data.entries = (rosterLookup || fixtureLookup) ? data.entries.map(publicEntry_) :
  [];
  if (!allowed('players')) data.players = resultLookup ? data.players.map(publicPlayer_) : [];
  if (!allowed('teams')) data.teams = entryLookup ? data.teams.map(function(team) {
    return Object.assign(publicTeam_(team), {
      ownerId: team.ownerId || ''
    });
  }) : [];
  if (!allowed('tournaments')) {
    const related = data.entries.map(function(e) {
      return e.tournamentId;
    }).concat(data.matches.map(function(m) {
      return m.tournamentId;
    }));
    data.tournaments = data.tournaments.filter(function(t) {
      return t.published || related.indexOf(t.id) >= 0;
    }).map(function(t) {
      return Object.assign(publicTournament_(t), {
        canManage: manages_(user, t), canReview:canReviewTournament_(user,t)
      }, fixtureLookup ? {
        venues: t.venues,
        duration: t.duration
      } : {});
    });
  }
  if (!allowed('sports')) {
    const sportIds = data.tournaments.map(function(t) {
      return t.sportId;
    });
    data.sports = data.sports.filter(function(s) {
      return (user.role === 'manager' && moduleAccess_(user,'tournaments') !== 'none') || sportIds.indexOf(s.id) >= 0;
    }).map(function(s) {
      return pick_(s, ['id', 'name', 'category', 'type']);
    });
  }
  ['rosterRequests', 'medals', 'passwordRequests', 'notifications', 'audit'].forEach(function(key) {
    if (!allowed(key)) data[key] = [];
  });
  if (!allowed('users')) data.users = allowed('matches') ? data.users.filter(function(u) {
    return u.role === 'referee' && u.verified;
  }).map(function(u) {
    return pick_(u, ['id', 'name', 'role', 'verified']);
  }) : [];
  return payload;
}

function saveSettings(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'settings');
    assert_(user.role === 'admin', 'Super Admin only.');
    const name = required_(data.brandName, 80);
    assert_(/^#[0-9a-f]{6}$/i.test(data.accent), 'Use a hex color.');
    put_('Settings', {
      id: 'brandName',
      value: name
    });
    put_('Settings', {
      id: 'accent',
      value: data.accent
    });
    audit_('settings', 'Settings', 'brand', data, user.id);
    return {
      ok: true
    };
  });
}

function saveSport(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'sports');
    assert_(competitionAdmin_(user), 'Admin permission required.');
    const old = data.id ? get_('Sports', data.id) : {};
    const sport = Object.assign({}, old, pick_(data, ['name', 'category', 'gender', 'type', 'notes']));
    sport.name = required_(sport.name, 100);
    sport.scoringRules = data.scoringRules || {
      mode: 'goals'
    };
    put_('Sports', sport);
    audit_('save', 'Sports', sport.id, {}, user.id);
    return {
      ok: true,
      id: sport.id
    };
  });
}

function saveTournament(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'tournaments');
    const old = data.id ? get_('Tournaments', data.id) : {};
    assert_(competitionAdmin_(user) || (user.role === 'manager' && (!old.id || manages_(user, old))), 'No tournament permission.');
    const t = Object.assign({
        format: 'league',
        legs: 1,
        groupCount: 2,
        qualifyPerGroup: 2,
        bestExtra: 0,
        pointsWin: 3,
        pointsDraw: 1,
        pointsLoss: 0,
        tiebreakers: ['goalDifference', 'goalsFor', 'headToHead', 'fairPlay', 'lot'],
        tieRule: 'penalties',
        minPlayers: 1,
        maxPlayers: 30,
        playersOnField: 11,
        allowDuplicate: false,
        managerIds: [],
        weekdays: [0, 1, 2, 3, 4, 5, 6],
        dayStart: '08:00',
        dayEnd: '18:00',
        duration: 90,
        breakMinutes: 15,
        minRest: 60,
        venues: ['Field 1'],
        blackoutDates: [],
        published: false,
        schedulePublished: false
      }, old,
      pick_(data, SCHEMA.Tournaments.filter(function(k) {
        return ['id', 'demo', 'archived', 'createdAt', 'updatedAt', 'managerIds', 'createdBy'].indexOf(k) < 0;
      })));
    t.createdBy = old.id ? (old.createdBy || '') : user.id;
    if (!old.id && user.role === 'manager') t.managerIds = [user.id];
    t.name = required_(t.name, 150);
    assert_(!get_('Sports', t.sportId).archived, 'Sport is archived.');
    assert_(['league', 'knockout', 'groups'].indexOf(t.format) >= 0, 'Invalid format.');
    ['legs', 'groupCount', 'qualifyPerGroup', 'minPlayers', 'maxPlayers', 'playersOnField', 'duration'].forEach(
      function(k) {
        t[k] = integer_(t[k], 1, k === 'duration' ? 480 : 256);
      });
    assert_(t.legs <= 2 && t.minPlayers <= t.maxPlayers, 'Invalid legs or roster limits.');
    ['bestExtra', 'pointsWin', 'pointsDraw', 'pointsLoss', 'breakMinutes', 'minRest'].forEach(function(k) {
      t[k] = integer_(t[k], 0, 1000);
    });
    assert_(Array.isArray(t.tiebreakers) && t.tiebreakers.every(function(v) {
      return ['goalDifference', 'goalsFor', 'wins', 'headToHead', 'fairPlay', 'lot'].indexOf(v) >=
        0;
    }), 'Invalid tiebreakers.');
    assert_(['penalties', 'extra_penalties'].indexOf(t.tieRule) >= 0, 'Invalid knockout tie rule.');
    assert_(Array.isArray(t.weekdays) && t.weekdays.length && t.weekdays.every(function(n) {
      return Number.isInteger(Number(n)) && Number(n) >= 0 && Number(n) <= 6;
    }), 'Select competition weekdays.');
    t.weekdays = t.weekdays.map(Number);
    assert_(Array.isArray(t.venues) && t.venues.length && t.venues.every(function(v) {
      return typeof v === 'string' && v.trim().length > 0;
    }), 'Enter venues.');
    assert_(new Set(t.venues).size === t.venues.length, 'Duplicate venues.');
    assert_(/^([01]\d|2[0-3]):[0-5]\d$/.test(t.dayStart) && /^([01]\d|2[0-3]):[0-5]\d$/.test(t.dayEnd) &&
      minutes_(t.dayStart) >= 0 && minutes_(t.dayEnd) <= 1440 && minutes_(t.dayEnd) > minutes_(t
        .dayStart), 'Invalid daily time window.');
    ['minAge','maxAge'].forEach(k => { t[k] = t[k] === '' || t[k] == null ? null : integer_(t[k],0,120); });
    assert_(t.minAge == null || t.maxAge == null || t.minAge <= t.maxAge, 'Invalid age range.');
    if (t.ageCutoffDate) dateOnly_(t.ageCutoffDate);
    assert_((t.minAge == null && t.maxAge == null) || t.ageCutoffDate || t.startDate,
      'AGE_RULE: ກະລຸນາກຳນົດວັນທີຄິດອາຍຸ ຫຼືວັນເລີ່ມແຂ່ງ.');
    if (old.id) active_('Players').filter(p => p.status === 'approved' &&
      get_('Entries',p.entryId).tournamentId === old.id).forEach(p => assertPlayerAge_(p,t));
    if (t.startDate) dateOnly_(t.startDate);
    if (t.endDate) dateOnly_(t.endDate);
    assert_(!t.startDate || !t.endDate || t.startDate <= t.endDate, 'End date precedes start date.');
    assert_(Array.isArray(t.blackoutDates), 'Invalid blackout dates.');
    t.blackoutDates.forEach(dateOnly_);
    if (t.rosterDeadline) t.rosterDeadline = iso_(t.rosterDeadline);
    assert_(['none', 'photo', 'document', 'in_person', ''].indexOf(t.identityRule || '') >= 0,
      'Invalid identity rule.');
    if (user.role === 'admin') {
      t.managerIds = Array.isArray(data.managerIds) ? data.managerIds : (old.managerIds || []);
      t.managerIds.forEach(function(id) {
        assert_(get_('Users', id).role === 'manager', 'Assign manager accounts only.');
      });
    }
    if (old.id && active_('Matches').some(function(m) {
        return m.tournamentId === old.id;
      })) {
      ['format', 'legs', 'groupCount', 'sportId'].forEach(function(key) {
        assert_(String(t[key]) === String(old[key]), 'Archive existing matches before changing ' +
          key);
      });
    }
    if (t.format === 'groups') {
      const assigned = new Set(approvedEntries_(t.id).map(e => e.group).filter(Boolean));
      assert_(assigned.size <= t.groupCount,'Move teams into the configured groups before reducing group count.');
    }
    put_('Tournaments', t);
    audit_('save', 'Tournaments', t.id, {
      before: old,
      after: t
    }, user.id);
    return {
      ok: true,
      id: t.id
    };
  });
}

function saveTeam(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'teams');
    const old = data.id ? get_('Teams', data.id) : {};
    assert_(['admin', 'operator', 'captain'].indexOf(user.role) >= 0,
      'Only captains and administrators create teams.');
    assert_(!old.id || owns_(user, old), 'Not your team.');
    assert_(old.status !== 'approved', 'Return the approved team for correction before editing.');
    const team = Object.assign({}, old, pick_(data, ['name', 'school', 'shortName', 'color', 'logoUrl',
      'contactName', 'phone', 'coach', 'notes', 'evidenceUrl']));
    team.name = required_(team.name, 100);
    team.contactName = required_(team.contactName, 100);
    team.phone = required_(phone_(team.phone), 30);
    team.logoUrl = safeUrl_(team.logoUrl);
    team.evidenceUrl = safeUrl_(team.evidenceUrl);
    team.ownerId = old.ownerId || user.id;
    team.status = 'pending';
    team.verificationCode = newResultCode_();
    team.reviewedName = '';
    team.reviewedBy = '';
    team.reviewedAt = '';
    put_('Teams', team);
    active_('Users').filter(function(u) {
      return u.verified && competitionAdmin_(u) && moduleAccess_(u, 'teams') === 'edit';
    }).forEach(function(u) {
      notify_(u.id, 'ທີມລໍຖ້າການຢັ້ງຢືນ: ' + team.name + ' · ' + team.verificationCode);
    });
    audit_('submit-team', 'Teams', team.id, {
      before: old,
      after: team
    }, user.id);
    return {
      ok: true,
      id: team.id
    };
  });
}

function getTeamDetails(token, teamId) {
  const user = auth_(token, true, 'teams');
  const data = getBootstrapData(token).privateData;
  const team = data.teams.find(function(t) {
    return t.id === teamId;
  });
  assert_(team && !team.archived, 'Team unavailable or outside your access.');
  const entries = data.entries.filter(function(e) {
    return e.teamId === teamId;
  });
  const entryIds = entries.map(function(e) {
    return e.id;
  });
  return {
    team: team,
    entries: entries.map(function(e) {
      return Object.assign({}, e, {
        tournamentName: (data.tournaments.find(function(t) {
          return t.id === e.tournamentId;
        }) || {}).name || e.tournamentId
      });
    }),
    players: data.players.filter(function(p) {
      return entryIds.indexOf(p.entryId) >= 0;
    })
  };
}

function reviewTeam(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'teams');
    assert_(competitionAdmin_(user), 'Only Super Admin or Admin staff may approve or return teams.');
    const team = get_('Teams', data.id);
    assert_(!team.archived, 'Team is archived.');
    assert_(['approved', 'revision'].indexOf(data.status) >= 0, 'Invalid review status.');
    assert_(data.status !== 'approved' || (!team.status || team.status === 'pending'),
      'Only pending teams can be approved.');
    assert_(data.status !== 'revision' || ['live', 'pending', 'approved'].indexOf(team.status || 'pending') >= 0,
      'Team already returned.');
    const before = Object.assign({}, team);
    team.reviewNote = data.status === 'revision' ? required_(data.reviewNote, 1000) : String(data
      .reviewNote || '').slice(0, 1000);
    team.status = data.status;
    team.verificationCode = team.verificationCode || newResultCode_();
    team.reviewedName = user.name;
    team.reviewedBy = user.id;
    team.reviewedAt = now_();
    put_('Teams', team);
    notify_(team.ownerId, (team.status === 'approved' ? '✅ ທີມຖືກຮັບຮອງ: ' :
        '↩ ກະລຸນາແກ້ໄຂທີມ ແລະບັນທຶກສົ່ງຄືນ: ') + team.name + ' · ' + team.verificationCode + ' · ' +
      team.reviewNote);
    audit_('review-team', 'Teams', team.id, {
      before: before,
      after: team
    }, user.id);
    return {
      ok: true
    };
  });
}

function registerTeam(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'entries');
    const team = get_('Teams', data.teamId);
    const t = get_('Tournaments', data.tournamentId);
    assert_(owns_(user, team), 'Not your team.');
    assert_(!t.archived && (t.published || manages_(user, t)), 'Tournament is not open.');
    assert_(!active_('Entries').some(function(e) {
      return e.teamId === team.id && e.tournamentId === t.id;
    }), 'Team already entered.');
    const entry = {
      tournamentId: t.id,
      teamId: team.id,
      status: 'pending',
      group: '',
      seed: 0,
      pot: 0,
      avoidTag: '',
      lot: Math.random()
    };
    put_('Entries', entry);
    notifyManagers_(t, 'Team registration: ' + team.name);
    audit_('register', 'Entries', entry.id, {}, user.id);
    return {
      ok: true,
      id: entry.id
    };
  });
}

function entryEligibility_(entry, tournament) {
  const players = active_('Players').filter(function(p) {
    return p.entryId === entry.id;
  });
  const min = Number(tournament.minPlayers);
  const max = Number(tournament.maxPlayers);
  const unverified = tournament.identityRule && tournament.identityRule !== 'none' ? players.filter(function(
    p) {
    return !p.verified;
  }).length : 0;
  const issues = players.map(p => playerAgeIssue_(p,tournament)).filter(Boolean);
  if (players.length < min) issues.push('ມີນັກກິລາ ' + players.length + ' ຄົນ; ຕ້ອງມີ ' + min + '–' + max +
    ' ຄົນ. ກະລຸນາເພີ່ມອີກ ' + (min - players.length) + ' ຄົນໃນເມນູນັກກິລາຂອງທີມ ແລະລາຍການນີ້.');
  if (players.length > max) issues.push('ມີນັກກິລາ ' + players.length + ' ຄົນ; ຕ້ອງມີ ' + min + '–' + max +
    ' ຄົນ. ກະລຸນາຫຼຸດອອກ ' + (players.length - max) + ' ຄົນ.');
  if (unverified) issues.push('ຍັງມີນັກກິລາ ' + unverified + ' ຄົນທີ່ບໍ່ທັນຢືນຢັນຕົວຕົນ.');
  if (entry.archived || tournament.archived || entry.status !== 'pending') issues.push(
    'ການສະໝັກຕ້ອງມີສະຖານະລໍຖ້າກວດສອບ ແລະບໍ່ຖືກເກັບເຂົ້າປະຫວັດ.');
  return {
    count: players.length,
    min: min,
    max: max,
    unverified: unverified,
    canApprove: !issues.length,
    issues: issues
  };
}

function getEntryReviewDetails(token, entryId) {
  const user = auth_(token, true, 'entries');
  const entry = get_('Entries', entryId);
  const tournament = tournamentAuth_(user, entry.tournamentId);
  assertTournamentReviewer_(user,tournament);
  return Object.assign(entryEligibility_(entry, tournament), {
    entryId: entry.id,
    teamName: get_('Teams', entry.teamId).name,
    tournamentName: tournament.name
  });
}

function reviewEntry(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'entries');
    const entry = get_('Entries', data.id);
    const t = tournamentAuth_(user, entry.tournamentId);
    assertTournamentReviewer_(user,t);
    assert_(!entry.archived, 'Registration is archived.');
    assert_(['revision', 'approved'].indexOf(data.status) >= 0,
      'Choose approval or return for correction.');
    assert_(data.status !== 'approved' || entry.status === 'pending',
      'Only pending registrations can be approved.');
    assert_(data.status !== 'revision' || ['pending', 'approved', 'rejected'].indexOf(entry.status) >= 0,
      'Registration already returned.');
    const reviewNote = data.status === 'revision' ? required_(data.reviewNote, 1000) : String(data
      .reviewNote || '').slice(0, 1000);
    if (data.status === 'approved') {
      const eligibility = entryEligibility_(entry, t);
      assert_(eligibility.canApprove, eligibility.issues.join(' '));
    }
    if (data.status !== 'approved') {
      assert_(!active_('Matches').some(function(m) {
        return m.tournamentId === t.id && [m.teamA, m.teamB].indexOf(entry.teamId) >= 0;
      }), 'Team has fixtures. Archive fixtures before removing approval.');
    }
    entry.status = data.status;
    entry.reviewNote = reviewNote;
    put_('Entries', entry);
    notify_(get_('Teams', entry.teamId).ownerId, 'Registration ' + entry.status + ': ' + t.name + '. ' +
      entry.reviewNote);
    audit_('review', 'Entries', entry.id, {
      status: entry.status,
      note: entry.reviewNote,
      reviewerName: user.name
    }, user.id);
    return {
      ok: true
    };
  });
}

function submitEntry(token, entryId) {
  return write_(function() {
    const user = auth_(token, false, 'entries');
    const entry = get_('Entries', entryId);
    const team = get_('Teams', entry.teamId);
    const t = get_('Tournaments', entry.tournamentId);
    assert_(owns_(user, team), 'Not your team.');
    assert_(!entry.archived && !team.archived && !t.archived, 'Registration unavailable.');
    assert_(entry.status === 'revision', 'Only returned registrations can be resubmitted.');
    entry.status = 'pending';
    put_('Entries', entry);
    notifyManagers_(t, 'Registration resubmitted: ' + team.name);
    audit_('resubmit-entry', 'Entries', entry.id, {
      reviewNote: entry.reviewNote
    }, user.id);
    return {
      ok: true
    };
  });
}

// Reuse a team's existing athlete profiles for another registered competition.
function teamRosterTarget_(user, entryId) {
  const entry = get_('Entries', entryId), team = get_('Teams', entry.teamId),
    tournament = get_('Tournaments', entry.tournamentId);
  assert_(!entry.archived && !team.archived && !tournament.archived, 'Registration unavailable.');
  assert_(owns_(user, team) || manages_(user, tournament), 'No roster permission.');
  return {entry: entry, team: team, tournament: tournament};
}
function teamRosterCandidates_(target) {
  const teamEntries = active_('Entries').filter(e => e.teamId === target.team.id).map(e => e.id);
  const registered = active_('Players').filter(p => p.entryId === target.entry.id).map(p => normalize_(p.identityKey));
  const seen = {};
  return active_('Players').filter(p => teamEntries.indexOf(p.entryId) >= 0 &&
    registered.indexOf(normalize_(p.identityKey)) < 0).sort((a,b) =>
      String(b.updatedAt).localeCompare(String(a.updatedAt))).filter(p => {
        const key = normalize_(p.identityKey);
        if (!key || seen[key]) return false;
        seen[key] = true; return true;
      });
}
function getTeamRosterSelection(token, entryId) {
  const user = auth_(token, true, 'players'), target = teamRosterTarget_(user, entryId);
  return {entryId: target.entry.id, teamName: target.team.name, tournamentName: target.tournament.name,
    candidates: teamRosterCandidates_(target).map(p => ({id:p.id, playerCode:p.playerCode, name:p.name, jersey:p.jersey}))};
}
function enrollTeamAthletes(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players'), target = teamRosterTarget_(user, data.entryId);
    assert_(competitionAdmin_(user) || (target.entry.status !== 'approved' &&
      (!target.tournament.rosterDeadline || Date.now() <= new Date(target.tournament.rosterDeadline).getTime())),
      'Return the approved roster or use a correction request.');
    const ids = Array.isArray(data.playerIds) ? data.playerIds : [];
    assert_(ids.length > 0 && ids.length <= 100 && new Set(ids).size === ids.length, 'Select athletes once.');
    const candidates = teamRosterCandidates_(target);
    const selected = ids.map(id => {
      const p = candidates.find(p => p.id === id); assert_(p, 'Athlete is unavailable or already selected.'); return p;
    });
    const count = active_('Players').filter(p => p.entryId === target.entry.id).length;
    assert_(count + selected.length <= Number(target.tournament.maxPlayers), 'Roster is full.');
    const profiles = selected.map(p => {
      const copy = Object.assign({}, pick_(p, ['playerCode','name','identityKey','birthDate','jersey','position',
        'photoUrl','identityDocumentUrl','certificateUrl','notes']), {entryId:target.entry.id});
      validatePlayer_(copy, target.tournament); return copy;
    });
    profiles.forEach((p,i) => {
      ['identityDocumentUrl','certificateUrl'].forEach(key => {
        const match = String(p[key] || '').match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view$/);
        if (match) {
          const props = PropertiesService.getScriptProperties();
          assert_(props.getProperty('PLAYER_DOC:' + match[1]) === selected[i].entryId, 'Document scope mismatch.');
          const file = DriveApp.getFileById(match[1]).makeCopy('Roster-' + p.playerCode + '-' + key,
            DriveApp.getFolderById(props.getProperty('UPLOAD_FOLDER_ID')));
          props.setProperty('PLAYER_DOC:' + file.getId(), target.entry.id);
          p[key] = 'https://drive.google.com/file/d/' + file.getId() + '/view';
        }
      });
      preparePlayerReview_(p); put_('Players',p);
      audit_('enroll-team-athlete','Players',p.id,{sourceId:selected[i].id,entryId:target.entry.id},user.id);
      notifyPlayerReviewers_(p,target.team);
    });
    return {ok:true, count:profiles.length, message:'ເລືອກນັກກິລາເຂົ້າລາຍການແລ້ວ · ' + profiles.length + ' · ລໍຖ້າຢືນຢັນ'};
  });
}

function savePlayer(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players');
    const entry = get_('Entries', data.entryId);
    const team = get_('Teams', entry.teamId);
    const t = get_('Tournaments', entry.tournamentId);
    assert_(!entry.archived && !t.archived, 'Registration or tournament is archived.');
    assert_(owns_(user, team) || manages_(user, t), 'No roster permission.');
    const old = data.id ? get_('Players', data.id) : {};
    assert_(!old.id || old.entryId === entry.id, 'Player belongs to another roster.');
    assert_(competitionAdmin_(user) || old.status !== 'approved',
      'Return the approved player for correction before editing.');
    assert_(!old.archived, 'Player is archived.');
    const player = Object.assign({}, old, pick_(data, ['name', 'identityKey', 'birthDate', 'jersey',
      'position', 'photoUrl', 'identityDocumentUrl', 'certificateUrl', 'notes']), {
      entryId: entry.id
    });
    player.name = required_(player.name, 100);
    player.identityKey = normalize_(required_(player.identityKey, 150));
    player.photoUrl = safeUrl_(player.photoUrl);
    ['identityDocumentUrl', 'certificateUrl'].forEach(function(key) {
      player[key] = playerDocumentUrl_(player[key], entry.id);
    });
    if (player.birthDate) dateOnly_(player.birthDate);
    player.notes = String(player.notes || '').trim();
    assert_(player.notes.length <= 5000, 'Notes are too long.');
    preparePlayerReview_(player);
    validatePlayer_(player, t);
    if (!competitionAdmin_(user) && old.status !== 'revision' && (entry.status === 'approved' || (!
        manages_(user, t) && t.rosterDeadline && Date.now() > new Date(t.rosterDeadline).getTime()))) {
      const request = queueRosterCorrection_(user, old, player, 'Roster change request', '');
      return {
        ok: true,
        id: request.id,
        message: 'ສົ່ງຄຳຂໍແກ້ໄຂແລ້ວ ລໍຖ້າ Admin ອະນຸມັດ'
      };
    }
    put_('Players', player);
    notifyPlayerReviewers_(player, team);
    audit_('save', 'Players', player.id, {
      before: old,
      after: player
    }, user.id);
    return {
      ok: true,
      id: player.id
    };
  });
}

function ensurePlayerCode_(player) {
  if (player.playerCode) return;
  const all = rows_('Players');
  const same = all.find(function(p) {
    return p.playerCode && p.identityKey && normalize_(p.identityKey) === normalize_(player.identityKey);
  });
  if (same) {
    player.playerCode = same.playerCode;
    return;
  }
  const highest = all.reduce(function(max, p) {
    const match = String(p.playerCode || '').match(/^DY(\d{4,})$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  const next = Math.max(highest, Number(PropertiesService.getScriptProperties().getProperty(
    'PLAYER_CODE_SEQUENCE') || 0)) + 1;
  player.playerCode = 'DY' + String(next).padStart(4, '0');
  PropertiesService.getScriptProperties().setProperty('PLAYER_CODE_SEQUENCE', String(next));
}

function getAthleteCompetitions(token, code) {
  auth_(token, true, 'players');
  assert_(/^DY\d{4,}$/.test(String(code)), 'Invalid athlete code.');
  const data = getBootstrapData(token).privateData;
  return data.players.filter(function(p) {
    return p.playerCode === code;
  }).map(function(p) {
    const entry = get_('Entries', p.entryId);
    return {
      id: p.id,
      playerCode: p.playerCode,
      name: p.name,
      status: p.status || 'pending',
      teamName: get_('Teams', entry.teamId).name,
      tournamentName: get_('Tournaments', entry.tournamentId).name,
      competition: publicTournament_(get_('Tournaments', entry.tournamentId))
    };
  });
}

function receivingEntry_(user, entryId) {
  const entry = get_('Entries', entryId),
    team = get_('Teams', entry.teamId),
    tournament = get_('Tournaments', entry.tournamentId);
  assert_(!entry.archived && !team.archived && !tournament.archived && (competitionAdmin_(user) || team
    .ownerId === user.id), 'Only the receiving team can request an incoming transfer.');
  return {
    entry: entry,
    team: team,
    tournament: tournament
  };
}

function getIncomingTransferEntries(token) {
  const user = auth_(token, true, 'players');
  return active_('Entries').filter(function(e) {
    return competitionAdmin_(user) || get_('Teams', e.teamId).ownerId === user.id;
  }).map(function(e) {
    return {
      id: e.id,
      name: get_('Teams', e.teamId).name + ' · ' + get_('Tournaments', e.tournamentId).name
    };
  });
}

function searchTransferAthletes(token, toEntryId, query, mode) {
  const user = auth_(token, true, 'players'),
    target = receivingEntry_(user, toEntryId),
    q = normalize_(required_(query, 150));
  rate_('transfer-search:' + user.id, 120, 3600);
  const compact = value => normalize_(value).normalize('NFKC').replace(/[\s\-]+/g, '');
  const needle = compact(q);
  assert_(needle.length > 0, 'Enter an athlete code, identity number or name.');
  return active_('Players').filter(function(p) {
    const e = get_('Entries', p.entryId),
      team = get_('Teams', e.teamId);
    if (e.archived || team.archived || get_('Tournaments', e.tournamentId).archived) return false;
    if (mode === 'identity') return e.tournamentId === target.entry.tournamentId && e.teamId !== target
      .entry.teamId && normalize_(p.identityKey) === q;
    return compact(p.playerCode).indexOf(needle) >= 0 || compact(p.identityKey) === needle ||
      compact(p.name).indexOf(needle) >= 0;
  }).slice(0, 20).map(function(p) {
    const from = get_('Entries', p.entryId);
    return {
      id: p.id,
      playerCode: p.playerCode,
      name: p.name,
      fromTeamName: get_('Teams', from.teamId).name,
      tournamentName: get_('Tournaments', from.tournamentId).name,
      sameTournament: from.tournamentId === target.entry.tournamentId,
      toTeamName: target.team.name,
      toEntryId: target.entry.id,
      alreadyInTeam: from.id === target.entry.id
    };
  });
}

function getPlayerTransferOptions(token, playerId) {
  const user = auth_(token, true, 'players'),
    player = get_('Players', playerId),
    from = get_('Entries', player.entryId);
  assert_(!player.archived && !from.archived && !get_('Teams', from.teamId).archived && !get_('Tournaments',
    from.tournamentId).archived, 'Athlete unavailable.');
  return active_('Entries').filter(function(e) {
    return e.teamId !== from.teamId && !get_('Teams', e.teamId).archived && !get_('Tournaments', e
      .tournamentId).archived && (competitionAdmin_(user) ||
      get_('Teams', e.teamId).ownerId === user.id);
  }).map(function(e) {
    return {
      id: e.id,
      name: get_('Teams', e.teamId).name + ' · ' + get_('Tournaments', e.tournamentId).name
    };
  });
}

function requestPlayerTransfer(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players');
    const p = get_('Players', data.playerId),
      from = get_('Entries', p.entryId),
      to = get_('Entries', data.toEntryId);
    const sourceTeam = get_('Teams', from.teamId),
      targetTeam = get_('Teams', to.teamId),
      t = get_('Tournaments', from.tournamentId);
    assert_(competitionAdmin_(user) || targetTeam.ownerId === user.id,
      'Only the receiving team can request an incoming transfer.');
    assert_(!p.archived && !from.archived && !to.archived && !sourceTeam.archived && !targetTeam
      .archived && !t.archived, 'Transfer unavailable.');
    assert_(from.teamId !== to.teamId && !get_('Tournaments', to.tournamentId).archived,
      'Choose another active receiving team.');
    assert_(!active_('PlayerTransfers').some(function(r) {
      return r.playerId === p.id && ['waiting_team', 'waiting_source', 'pending'].indexOf(r
        .status) >= 0;
    }), 'A transfer request is already pending.');
    ensurePlayerCode_(p);
    if (!get_('Players', p.id).playerCode) put_('Players', p);
    const request = {
      playerId: p.id,
      playerCode: p.playerCode,
      playerName: p.name,
      fromEntryId: from.id,
      toEntryId: to.id,
      tournamentId: t.id,
      requestedBy: user.id,
      status: 'waiting_source',
      initiatorSide: 'receiving',
      reason: required_(data.reason, 1000),
      playerStamp: p.verificationCode + '|' + p.updatedAt,
      verificationCode: newResultCode_()
    };
    put_('PlayerTransfers', request);
    notify_(sourceTeam.ownerId, 'ທີມ ' + targetTeam.name + ' ຂໍຮັບໂອນ: ' + p.name + ' · ' + p.playerCode +
      ' · ກະລຸນາຢືນຢັນປ່ອຍໂຕ ຫຼືປະຕິເສດພ້ອມເຫດຜົນ');
    audit_('request-player-transfer', 'PlayerTransfers', request.id, request, user.id);
    return {
      ok: true,
      id: request.id
    };
  });
}

function respondPlayerTransfer(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players'),
      r = get_('PlayerTransfers', data.id);
    const requiredEntry = get_('Entries', r.initiatorSide === 'receiving' ? r.fromEntryId : r.toEntryId),
      confirmingTeam = get_('Teams', requiredEntry.teamId);
    const to = get_('Entries', r.toEntryId),
      target = get_('Teams', to.teamId);
    const staffRelease = r.initiatorSide === 'receiving' && competitionAdmin_(user);
    assert_(confirmingTeam.ownerId === user.id || staffRelease,
      'Only the original team owner can authorize release for incoming requests.');
    assert_(r.status === (r.initiatorSide === 'receiving' ? 'waiting_source' : 'waiting_team') && !r
      .archived && !requiredEntry.archived && !confirmingTeam.archived,
      'Request is not awaiting team confirmation.');
    assert_(['accept', 'reject'].indexOf(data.decision) >= 0, 'Invalid response.');
    r.status = data.decision === 'accept' ? 'pending' : 'rejected';
    r.reviewNote = data.decision === 'reject' ? required_(data.reason, 1000) : '';
    r.acceptedBy = data.decision === 'accept' ? user.id : '';
    r.acceptedAt = now_();
    r.acceptedAsStaff = data.decision === 'accept' && staffRelease && confirmingTeam.ownerId !== user.id;
    r.acceptedTeamOwnerId = data.decision === 'accept' ? confirmingTeam.ownerId : '';
    r.acceptedName = data.decision === 'accept' ? user.name : '';
    put_('PlayerTransfers', r);
    if (r.status === 'pending') notifyPlayerReviewers_({
      name: r.playerName,
      verificationCode: r.verificationCode
    }, target);
    notify_(get_('Teams', get_('Entries', r.initiatorSide === 'receiving' ? r.toEntryId : r.fromEntryId)
        .teamId).ownerId, 'ຄຳຂໍໂອນ: ' + r.playerCode +
      ' · ' + r.status + ' · ' + r.reviewNote);
    if (r.acceptedAsStaff) notify_(confirmingTeam.ownerId, 'Admin ຢືນຢັນປ່ອຍໂຕແທນທີມ: ' + r.playerCode +
      ' · ' + user.name);
    audit_('respond-player-transfer', 'PlayerTransfers', r.id, r, user.id);
    return {
      ok: true
    };
  });
}

function reviewPlayerTransfer(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players');
    assert_(competitionAdmin_(user), 'Only Super Admin or Admin staff approve transfers.');
    const r = get_('PlayerTransfers', data.id);
    assert_(!r.archived && r.status === 'pending',
      'Original team must confirm first for incoming transfers.');
    assert_(['approved', 'rejected'].indexOf(data.status) >= 0, 'Invalid review status.');
    const p = get_('Players', r.playerId),
      from = get_('Entries', r.fromEntryId),
      to = get_('Entries', r.toEntryId),
      t = get_('Tournaments', r.tournamentId);
    const source = get_('Teams', from.teamId),
      target = get_('Teams', to.teamId);
    assert_(!p.archived && !from.archived && !to.archived && !source.archived && !target.archived && !t
      .archived, 'Transfer unavailable.');
    if (data.status === 'approved') {
      const staffConfirmed = r.initiatorSide === 'receiving' && r.acceptedAsStaff === true &&
        r.acceptedTeamOwnerId === source.ownerId && competitionAdmin_(get_('Users', r.acceptedBy));
      assert_(staffConfirmed || (!r.acceptedAsStaff && r.acceptedBy ===
          (r.initiatorSide === 'receiving' ? source.ownerId : target.ownerId)),
        'Confirming team owner changed; submit a new transfer.');
      assert_(p.entryId === from.id && r.playerStamp === p.verificationCode + '|' + p.updatedAt,
        'Player changed; reject this request and submit a new transfer.');
      assert_(!active_('StatAdjustments').some(a => a.playerId === p.id && ['goalsDelta','yellowDelta','redDelta'].some(k => Number(a[k] || 0) !== 0)), 'Player has adjusted statistics; transfer would change match history.');
      assert_(!active_('Results').some(function(result) {
        return ['live', 'pending', 'approved'].indexOf(result.status) >= 0 && (result.events || []).some(
          function(e) {
            return e.playerId === p.id;
          });
      }), 'Player has recorded match events; transfer would change match history.');
      if (from.status === 'approved') assert_(active_('Players').filter(function(x) {
        return x.entryId === from.id && x.id !== p.id;
      }).length >= Number(t.minPlayers), 'Source team would have too few players.');
      const before = Object.assign({}, p),
        moved = Object.assign({}, p, {
          entryId: to.id
        });
      const destinationTournament = get_('Tournaments', to.tournamentId);
      assert_(!destinationTournament.archived, 'Destination tournament unavailable.');
      validatePlayer_(moved, destinationTournament);
      ['identityDocumentUrl', 'certificateUrl'].forEach(function(key) {
        const match = String(moved[key] || '').match(
          /^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view$/);
        if (match && PropertiesService.getScriptProperties().getProperty('PLAYER_DOC:' + match[1]) ===
          from.id) {
          const copy = DriveApp.getFileById(match[1]).makeCopy('Transfer-' + p.playerCode + '-' + key,
            DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty(
              'UPLOAD_FOLDER_ID')));
          PropertiesService.getScriptProperties().setProperty('PLAYER_DOC:' + copy.getId(), to.id);
          moved[key] = 'https://drive.google.com/file/d/' + encodeURIComponent(copy.getId()) +
            '/view';
        }
      });
      preparePlayerReview_(moved);
      moved.status = 'approved';
      moved.verified = true;
      moved.reviewedBy = user.id;
      moved.reviewedName = user.name;
      moved.reviewedAt = now_();
      moved.reviewNote = String(data.reviewNote || '').slice(0, 1000);
      put_('Players', moved);
      audit_('transfer-player', 'Players', p.id, {
        before: before,
        after: moved,
        transferId: r.id
      }, user.id);
    }
    r.status = data.status;
    r.reviewNote = data.status === 'rejected' ? required_(data.reviewNote, 1000) : String(data
      .reviewNote || '').slice(0, 1000);
    r.reviewedBy = user.id;
    r.reviewedAt = now_();
    put_('PlayerTransfers', r);
    [source.ownerId, target.ownerId].filter(function(id, i, a) {
      return a.indexOf(id) === i;
    }).forEach(function(id) {
      notify_(id, 'ຜົນການໂອນ ' + r.playerCode + ' · ' + r.status + ' · ' + r.reviewNote);
    });
    audit_('review-player-transfer', 'PlayerTransfers', r.id, r, user.id);
    return {
      ok: true
    };
  });
}

function preparePlayerReview_(player) {
  ensurePlayerCode_(player);
  player.verified = false;
  player.status = 'pending';
  player.verificationCode = newResultCode_();
  player.reviewedBy = '';
  player.reviewedName = '';
  player.reviewedAt = '';
}

function notifyPlayerReviewers_(player, team) {
  const entry=rows_('Entries').find(e=>e.id === player.entryId);
  const tournament=entry && rows_('Tournaments').find(t=>t.id === entry.tournamentId);
  active_('Users').filter(function(u) {
    return u.verified && !u.disabled && (competitionAdmin_(u) || (tournament && canReviewTournament_(u,tournament))) && moduleAccess_(u, 'players') === 'edit';
  }).forEach(function(u) {
    notify_(u.id, 'ນັກກິລາລໍຖ້າຢືນຢັນ: ' + player.name + ' · ' + team.name + ' · ' + player
      .verificationCode);
  });
}

function getPlayerDetails(token, playerId) {
  const user = auth_(token, true, 'players');
  const player = get_('Players', playerId);
  const entry = get_('Entries', player.entryId);
  const team = get_('Teams', entry.teamId);
  const tournament = get_('Tournaments', entry.tournamentId);
  assert_(!player.archived && !entry.archived && !team.archived && !tournament.archived && (owns_(user,
    team) || manages_(user, tournament)), 'No player permission.');
  return {
    player: player,
    teamName: team.name,
    tournamentName: tournament.name,
    entryStatus: entry.status
  };
}

function reviewPlayer(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'players');
    const player = get_('Players', data.id);
    const entry = get_('Entries', player.entryId);
    const team = get_('Teams', entry.teamId);
    const tournament = get_('Tournaments', entry.tournamentId);
    assertTournamentReviewer_(user,tournament);
    assert_(!player.archived && !entry.archived && !team.archived && !tournament.archived,
      'Player unavailable.');
    assert_(['approved', 'revision'].indexOf(data.status) >= 0, 'Invalid review status.');
    assert_(data.status !== 'approved' || !player.status || player.status === 'pending' || (player
        .status === 'approved' && !player.verified),
      'Only pending players can be approved.');
    assert_(data.status !== 'revision' || ['live', 'pending', 'approved'].indexOf(player.status || 'pending') >=
      0, 'Player already returned.');
    if (data.status === 'approved') assertPlayerAge_(player,tournament);
    const before = Object.assign({}, player);
    player.reviewNote = data.status === 'revision' ? required_(data.reviewNote, 1000) : String(data
      .reviewNote || '').slice(0, 1000);
    ensurePlayerCode_(player);
    player.status = data.status;
    player.verified = data.status === 'approved';
    player.verificationCode = player.verificationCode || newResultCode_();
    player.reviewedBy = user.id;
    player.reviewedName = user.name;
    player.reviewedAt = now_();
    put_('Players', player);
    notify_(team.ownerId, (data.status === 'approved' ? '✅ ຮັບຮອງນັກກິລາ: ' :
        '↩ ກະລຸນາແກ້ໄຂນັກກິລາ ແລະບັນທຶກສົ່ງຄືນ: ') + player.name + ' · ' + player.verificationCode +
      ' · ' + player.reviewNote);
    audit_('review-player', 'Players', player.id, {
      before: before,
      after: player
    }, user.id);
    return {
      ok: true
    };
  });
}

function correctionPlayer_(user, playerId) {
  const player = get_('Players', playerId),
    entry = get_('Entries', player.entryId),
    team = get_('Teams', entry.teamId),
    tournament = get_('Tournaments', entry.tournamentId);
  assert_(!player.archived && !entry.archived && !team.archived && !tournament.archived && (competitionAdmin_(
    user) || team.ownerId === user.id), 'No permission to request corrections for this athlete.');
  return {
    player: player,
    entry: entry,
    team: team,
    tournament: tournament
  };
}

function rosterRequestScope_(user, request) {
  const entry = get_('Entries', request.entryId),
    team = get_('Teams', entry.teamId),
    tournament = get_('Tournaments', entry.tournamentId);
  assert_(!request.archived && !entry.archived && !team.archived && !tournament.archived && (
      competitionAdmin_(user) || team.ownerId === user.id || manages_(user, tournament)),
    'No roster request permission.');
  return {
    entry: entry,
    team: team,
    tournament: tournament
  };
}

function getRosterCorrectionOptions(token) {
  const user = auth_(token, true, 'rosterRequests');
  return active_('Players').filter(function(p) {
    const e = get_('Entries', p.entryId);
    return competitionAdmin_(user) || get_('Teams', e.teamId).ownerId === user.id;
  }).map(function(p) {
    const e = get_('Entries', p.entryId);
    return {
      id: p.id,
      name: (p.playerCode || p.id) + ' · ' + p.name + ' · ' + get_('Teams', e.teamId).name + ' · ' + get_(
        'Tournaments', e.tournamentId).name
    };
  });
}

function correctionSource_(user, playerId, requestId) {
  if (playerId) return correctionPlayer_(user, playerId);
  assert_(requestId, 'Choose an athlete.');
  const r = get_('RosterRequests', requestId),
    scope = rosterRequestScope_(user, r);
  assert_(!r.playerId && r.status === 'revision' && (competitionAdmin_(user) || scope.team.ownerId === user
    .id), 'Only a returned new-athlete request can be edited.');
  return {
    player: {
      id: '',
      entryId: scope.entry.id,
      playerCode: r.payload.playerCode || ''
    },
    entry: scope.entry,
    team: scope.team,
    tournament: scope.tournament
  };
}

function getRosterCorrectionSource(token, playerId, requestId) {
  const user = auth_(token, true, 'rosterRequests'),
    source = correctionSource_(user, playerId, requestId);
  if (requestId) {
    const r = get_('RosterRequests', requestId);
    rosterRequestScope_(user, r);
    assert_((r.playerId || '') === (playerId || '') && r.status === 'revision' && r.entryId === source.entry
      .id,
      'Only returned requests can be edited.');
    source.proposed = r.payload;
    source.requestId = r.id;
    source.reason = r.reason;
  }
  return {
    player: source.player,
    proposed: source.proposed || source.player,
    requestId: source.requestId || '',
    reason: source.reason || '',
    teamName: source.team.name,
    tournamentName: source.tournament.name,
    tournamentId: source.tournament.id
  };
}

function sanitizeCorrection_(old, data, entry) {
  const player = Object.assign({}, old, pick_(data, ['name', 'identityKey', 'birthDate', 'jersey', 'position',
    'photoUrl', 'identityDocumentUrl', 'certificateUrl', 'notes']));
  player.entryId = entry.id;
  player.id = old.id || '';
  player.playerCode = old.playerCode || data.playerCode || '';
  player.name = required_(player.name, 100);
  player.identityKey = normalize_(required_(player.identityKey, 150));
  if (player.birthDate) dateOnly_(player.birthDate);
  player.photoUrl = safeUrl_(player.photoUrl);
  ['identityDocumentUrl', 'certificateUrl'].forEach(function(key) {
    player[key] = playerDocumentUrl_(player[key], entry.id);
  });
  player.notes = String(player.notes || '').trim();
  assert_(player.notes.length <= 5000, 'Notes are too long.');
  return player;
}

function queueRosterCorrection_(user, before, proposal, reason, requestId) {
  const existing = requestId ? get_('RosterRequests', requestId) : null;
  if (existing) assert_(!existing.archived && existing.status === 'revision' && existing.playerId === before
    .id && existing.entryId === proposal.entryId, 'Only returned requests can be edited.');
  assert_(!active_('RosterRequests').some(function(r) {
    return r.id !== requestId && ['pending', 'revision'].indexOf(r.status) >= 0 && r.entryId ===
      proposal.entryId && ((before.id && r.playerId === before.id) || (!before.id && r.payload && r
        .payload.identityKey === proposal.identityKey));
  }), 'A correction request is already pending or returned. Edit that request instead.');
  const request = Object.assign({}, existing || {}, {
    entryId: proposal.entryId,
    playerId: before.id || '',
    playerCode: proposal.playerCode,
    before: before,
    payload: proposal,
    status: 'pending',
    reason: reason,
    requestedBy: user.id,
    submittedAt: now_(),
    verificationCode: newResultCode_(),
    baseStamp: before.id ? before.verificationCode + '|' + before.updatedAt : '',
    reviewedBy: '',
    reviewedAt: ''
  });
  put_('RosterRequests', request);
  active_('Users').filter(function(u) {
    return u.verified && competitionAdmin_(u) && moduleAccess_(u, 'rosterRequests') === 'edit';
  }).forEach(function(u) {
    notify_(u.id, 'ຄຳຂໍແກ້ໄຂນັກກິລາ: ' + proposal.name + ' · ' + proposal.playerCode + ' · ' + request
      .verificationCode);
  });
  audit_('submit-roster-correction', 'RosterRequests', request.id, {
    before: before,
    proposed: proposal,
    reason: reason
  }, user.id);
  return request;
}

function submitRosterCorrection(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'rosterRequests'),
      source = correctionSource_(user, data.playerId, data.requestId);
    const player = sanitizeCorrection_(source.player, data, source.entry);
    preparePlayerReview_(player);
    validatePlayer_(player, source.tournament);
    const request = queueRosterCorrection_(user, source.player, player, required_(data.reason, 1000), data
      .requestId || '');
    return {
      ok: true,
      id: request.id,
      verificationCode: request.verificationCode
    };
  });
}

function getRosterRequestDetails(token, requestId) {
  const user = auth_(token, true, 'rosterRequests'),
    r = get_('RosterRequests', requestId),
    scope = rosterRequestScope_(user, r);
  const current = r.playerId ? get_('Players', r.playerId) : {};
  const moved = !!current.id && current.entryId !== r.entryId;
  return {
    request: r,
    current: moved ? (r.before || {}) : current,
    moved: moved,
    teamName: scope.team.name,
    tournamentName: scope.tournament.name
  };
}

function getRosterRequestDocument(token, requestId, field, side) {
  const user = auth_(token, true, 'rosterRequests'),
    r = get_('RosterRequests', requestId);
  rosterRequestScope_(user, r);
  assert_(['identityDocumentUrl', 'certificateUrl'].indexOf(field) >= 0, 'Invalid document field.');
  return readRosterDocument_((side === 'before' ? (r.before || {}) : r.payload)[field], r.entryId);
}

function reviewRosterRequest(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'rosterRequests');
    const request = get_('RosterRequests', data.id),
      scope = rosterRequestScope_(user, request);
    assertTournamentReviewer_(user,scope.tournament);
    assert_(request.status === 'pending', 'Request already reviewed.');
    assert_(['approved', 'revision', 'rejected'].indexOf(data.status) >= 0, 'Invalid status.');
    const note = data.status === 'approved' ? String(data.note || '').slice(0, 1000) : required_(data
      .note, 1000);
    let applied = null;
    if (data.status === 'approved') {
      const old = request.playerId ? get_('Players', request.playerId) : {};
      assert_(!old.archived && (!old.id || old.entryId === request.entryId),
        'Athlete moved or was archived. Return or reject this request.');
      if (old.id) assert_(request.baseStamp && request.baseStamp === old.verificationCode + '|' + old
        .updatedAt,
        'Return this request for correction: athlete data changed or this is an old request.');
      const player = sanitizeCorrection_(old, request.payload, scope.entry);
      if (!old.id) {
        const same = rows_('Players').find(function(p) {
          return p.identityKey === player.identityKey && p.playerCode;
        });
        if (same) player.playerCode = same.playerCode;
      }
      ensurePlayerCode_(player);
      validatePlayer_(player, scope.tournament);
      player.status = 'approved';
      player.verified = true;
      player.verificationCode = request.verificationCode || newResultCode_();
      player.reviewNote = note;
      player.reviewedBy = user.id;
      player.reviewedName = user.name;
      player.reviewedAt = now_();
      put_('Players', player);
      applied = player;
      request.playerId = player.id;
      request.playerCode = player.playerCode;
      audit_('apply-roster-correction', 'Players', player.id, {
        before: old,
        after: player,
        requestId: request.id
      }, user.id);
    }
    request.status = data.status;
    request.note = note;
    request.reviewedBy = user.id;
    request.reviewedAt = now_();
    put_('RosterRequests', request);
    notify_(scope.team.ownerId, 'ຄຳຂໍແກ້ໄຂ ' + (request.playerCode || request.payload.name) + ' · ' +
      request.status + ' · ' + note);
    audit_('review-roster', 'RosterRequests', request.id, {
      status: request.status,
      note: note,
      applied: applied
    }, user.id);
    return {
      ok: true
    };
  });
}

function playerDocumentUrl_(value, entryId) {
  const url = safeUrl_(value);
  const match = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view$/);
  const uploadedEntry = match && PropertiesService.getScriptProperties().getProperty('PLAYER_DOC:' + match[
    1]);
  assert_(!uploadedEntry || uploadedEntry === entryId, 'Document belongs to another roster.');
  return url;
}

function uploadPlayerDocument(token, data) {
  return write_(function() {
    const user = auth_(token, false, data.forCorrection ? 'rosterRequests' : 'players');
    const entry = get_('Entries', data.entryId);
    const team = get_('Teams', entry.teamId);
    const tournament = get_('Tournaments', entry.tournamentId);
    assert_(owns_(user, team) || manages_(user, tournament), 'No roster permission.');
    const returningPlayer = data.playerId ? get_('Players', data.playerId) : null;
    assert_(!returningPlayer || returningPlayer.entryId === entry.id,
      'Player belongs to another roster.');
    let returnedDraft = false;
    if (data.forCorrection === true && data.requestId) {
      const r = get_('RosterRequests', data.requestId);
      rosterRequestScope_(user, r);
      returnedDraft = r.status === 'revision' && r.entryId === entry.id && !r.playerId;
    }
    assert_(!entry.archived && !team.archived && !tournament.archived && (entry.status !== 'approved' ||
        competitionAdmin_(user) || returnedDraft || (returningPlayer && !returningPlayer.archived && (
          returningPlayer
          .status === 'revision' || data.forCorrection === true))),
      'Return the approved registration before uploading documents.');
    assert_(['identityDocumentUrl', 'certificateUrl'].indexOf(data.field) >= 0,
      'Invalid document field.');
    rate_('document-upload:' + user.id, 30, 3600);
    const raw = String(data.base64 || '');
    assert_(raw.length > 0 && raw.length <= 2800000, 'File must be under 2 MB.');
    const bytes = Utilities.base64Decode(raw);
    assert_(bytes.length > 0 && bytes.length <= 2 * 1024 * 1024, 'File must be under 2 MB.');
    const hex = bytes.slice(0, 12).map(function(b) {
      return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
    }).join('');
    let mime = '',
      ext = '';
    if (hex.indexOf('ffd8ff') === 0) {
      mime = 'image/jpeg';
      ext = '.jpg';
    }
    if (hex.indexOf('89504e470d0a1a0a') === 0) {
      mime = 'image/png';
      ext = '.png';
    }
    if (hex.indexOf('474946383761') === 0 || hex.indexOf('474946383961') === 0) {
      mime = 'image/gif';
      ext = '.gif';
    }
    if (hex.indexOf('255044462d') === 0) {
      mime = 'application/pdf';
      ext = '.pdf';
    }
    assert_(mime, 'Only JPEG, PNG, GIF or PDF files are supported.');
    const folder = PropertiesService.getScriptProperties().getProperty('UPLOAD_FOLDER_ID');
    assert_(folder, 'Run setupSystem first.');
    const file = DriveApp.getFolderById(folder).createFile(Utilities.newBlob(bytes, mime, data.field +
      '-' + id_() + ext));
    // Identity documents stay private. Do not enable anyone-with-link sharing.
    PropertiesService.getScriptProperties().setProperty('PLAYER_DOC:' + file.getId(), entry.id);
    audit_('upload-player-document', 'Entries', entry.id, {
      field: data.field,
      fileId: file.getId()
    }, user.id);
    return {
      url: 'https://drive.google.com/file/d/' + encodeURIComponent(file.getId()) + '/view'
    };
  });
}

function getPlayerDocument(token, playerId, field) {
  const user = auth_(token, true, 'players');
  assert_(['identityDocumentUrl', 'certificateUrl'].indexOf(field) >= 0, 'Invalid document field.');
  const player = get_('Players', playerId);
  const entry = get_('Entries', player.entryId);
  const team = get_('Teams', entry.teamId);
  const tournament = get_('Tournaments', entry.tournamentId);
  assert_(!player.archived && !entry.archived && !team.archived && !tournament.archived && (owns_(user,
    team) || manages_(user, tournament)), 'No document permission.');
  return readRosterDocument_(player[field], entry.id);
}

function readRosterDocument_(value, entryId) {
  const url = playerDocumentUrl_(value, entryId);
  assert_(url, 'No document attached.');
  const match = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view$/);
  if (!match || PropertiesService.getScriptProperties().getProperty('PLAYER_DOC:' + match[1]) !== entryId)
    return {
      url: url
    };
  const file = DriveApp.getFileById(match[1]);
  const blob = file.getBlob();
  const bytes = blob.getBytes();
  assert_(bytes.length <= 2 * 1024 * 1024, 'File exceeds download limit.');
  const mime = blob.getContentType();
  assert_(['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].indexOf(mime) >= 0,
    'Unsupported document.');
  return {
    base64: Utilities.base64Encode(bytes),
    mime: mime,
    name: file.getName()
  };
}

function uploadImage(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'uploads');
    assert_(['admin', 'operator', 'manager', 'captain'].indexOf(user.role) >= 0, 'No upload permission.');
    rate_('upload:' + user.id, 30, 3600);
    const raw = String(data.base64 || '');
    assert_(raw.length <= 2800000, 'Image must be under 2 MB.');
    const bytes = Utilities.base64Decode(raw);
    const hex = bytes.slice(0, 12).map(function(b) {
      return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
    }).join('');
    let mime = '';
    if (hex.indexOf('ffd8ff') === 0) mime = 'image/jpeg';
    if (hex.indexOf('89504e470d0a1a0a') === 0) mime = 'image/png';
    if (hex.indexOf('474946383761') === 0 || hex.indexOf('474946383961') === 0) mime = 'image/gif';
    assert_(mime, 'Only JPEG, PNG and GIF images are supported.');
    const folderId = PropertiesService.getScriptProperties().getProperty('UPLOAD_FOLDER_ID');
    assert_(folderId, 'Run setupSystem first.');
    const file = DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, mime, user.id +
      '-' + id_()));
    // Public images are used in approved public team/player profiles.
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (error) {
      file.setTrashed(true);
      throw new Error(
        'Your Google Workspace policy blocks public image sharing. Use a permitted HTTPS image URL instead.'
      );
    }
    audit_('upload', 'Drive', file.getId(), {
      owner: user.id
    }, user.id);
    return {
      url: 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(file.getId()) + '&sz=w600'
    };
  });
}

function saveDrawEntries(token, tournamentId, assignments) {
  return write_(function() {
    const user = auth_(token, false, 'tournaments');
    const t = tournamentAuth_(user, tournamentId);
    assert_(!active_('Matches').some(function(m) {
      return m.tournamentId === t.id;
    }), 'Draw is locked after fixtures exist.');
    const entries = approvedEntries_(t.id);
    assert_(Array.isArray(assignments), 'Invalid assignments.');
    const planned = entries.map(function(entry) {
      const a = assignments.find(function(r) {
        return r.id === entry.id;
      }) || entry;
      const group = String(a.group || '').trim().slice(0, 30);
      return Object.assign({}, entry, {
        group: group,
        seed: integer_(a.seed || 0, 0, 256),
        pot: integer_(a.pot || 0, 0, 256),
        avoidTag: String(a.avoidTag || '').trim().slice(0, 100)
      });
    });
    const seeds = planned.map(function(e) {
      return e.seed;
    }).filter(Boolean);
    assert_(new Set(seeds).size === seeds.length, 'Seed numbers must be unique.');
    const groups = new Set(planned.map(function(e) {
      return e.group;
    }).filter(Boolean));
    assert_(t.format !== 'groups' || groups.size <= t.groupCount, 'Too many groups.');
    validateGroups_(planned.filter(function(e) {
      return e.group;
    }));
    planned.forEach(function(e) {
      put_('Entries', e);
    });
    audit_('draw-manual', 'Tournaments', t.id, planned.map(publicEntry_), user.id);
    return {
      ok: true
    };
  });
}

function randomizeGroups(token, tournamentId) {
  return write_(function() {
    const user = auth_(token, false, 'tournaments');
    const t = tournamentAuth_(user, tournamentId);
    assert_(t.format === 'groups', 'Group format required.');
    assert_(!active_('Matches').some(function(m) {
      return m.tournamentId === t.id;
    }), 'Archive fixtures first.');
    const entries = approvedEntries_(t.id);
    assert_(entries.length >= t.groupCount * 2 && entries.length <= 128,
      'Each group needs at least two teams; maximum 128 teams.');
    const capacity = Math.ceil(entries.length / t.groupCount);
    let solution = null;
    for (let attempt = 0; attempt < 200 && !solution; attempt++) {
      const groups = Array.from({
        length: t.groupCount
      }, function() {
        return [];
      });
      const pool = shuffle_(entries).sort(function(a, b) {
        return (a.pot || 999) - (b.pot || 999) || (a.seed || 999) - (b.seed || 999);
      });
      let failed = false;
      for (let i = 0; i < pool.length; i++) {
        const entry = pool[i];
        const possible = shuffle_(groups.map(function(g, n) {
          return n;
        })).filter(function(n) {
          const g = groups[n];
          return g.length < capacity && !g.some(function(other) {
            return (entry.pot && other.pot === entry.pot) || (entry.avoidTag && entry.avoidTag ===
              other.avoidTag);
          });
        }).sort(function(a, b) {
          return groups[a].length - groups[b].length;
        });
        if (!possible.length) {
          failed = true;
          break;
        }
        groups[possible[0]].push(entry);
      }
      if (!failed && groups.every(function(g) {
          return g.length >= 2;
        })) solution = groups;
    }
    assert_(solution, 'No valid draw found. Adjust pots/restrictions or assign groups manually.');
    solution.forEach(function(group, i) {
      group.forEach(function(e) {
        put_('Entries', Object.assign(e, {
          group: 'G' + (i + 1)
        }));
      });
    });
    audit_('draw-random', 'Tournaments', t.id, solution.map(function(g) {
      return g.map(function(e) {
        return e.teamId;
      });
    }), user.id);
    return {
      ok: true
    };
  });
}

function generateMatches(token, tournamentId, mode) {
  return write_(function() {
    const user = auth_(token, false, 'matches');
    const t = tournamentAuth_(user, tournamentId);
    assert_(!active_('Matches').some(function(m) {
      return m.tournamentId === t.id;
    }), 'Fixtures already exist. Archive them before generating again.');
    const entries = approvedEntries_(t.id);
    assert_(entries.length >= 2 && entries.length <= 128, 'Select 2–128 approved teams.');
    let plan = [];
    if (t.format === 'knockout') {
      plan = knockoutPlan_(t, entries, mode || 'random');
    } else if (t.format === 'groups') {
      assert_(entries.every(function(e) {
        return e.group;
      }), 'Assign groups first.');
      validateGroups_(entries);
      const groups = Array.from(new Set(entries.map(function(e) {
        return e.group;
      }))).sort();
      assert_(groups.length === t.groupCount, 'Group count does not match tournament settings.');
      groups.forEach(function(g) {
        const teams = entries.filter(function(e) {
          return e.group === g;
        }).map(function(e) {
          return e.teamId;
        });
        assert_(teams.length >= 2, 'Every group needs at least two teams.');
        plan = plan.concat(leaguePlan_(t, teams, g));
      });
    } else {
      plan = leaguePlan_(t, entries.map(function(e) {
        return e.teamId;
      }), '');
    }
    plan.forEach(function(m) {
      put_('Matches', m);
    });
    audit_('generate-fixtures', 'Tournaments', t.id, {
      count: plan.length,
      mode: mode
    }, user.id);
    return {
      ok: true,
      count: plan.length
    };
  });
}

function advanceGroups(token, tournamentId) {
  return write_(function() {
    const user = auth_(token, false, 'matches');
    const t = tournamentAuth_(user, tournamentId);
    assert_(t.format === 'groups', 'Group tournament required.');
    const matches = active_('Matches').filter(function(m) {
      return m.tournamentId === t.id;
    });
    assert_(!matches.some(function(m) {
      return m.phase === 'knockout';
    }), 'Knockout already exists.');
    const groupMatches = matches.filter(function(m) {
      return m.phase === 'group';
    });
    const results = active_('Results').filter(function(r) {
      return r.status === 'approved';
    });
    assert_(groupMatches.length && groupMatches.every(function(m) {
      return m.status === 'cancelled' || results.some(function(r) {
        return r.matchId === m.id;
      });
    }), 'Confirm every group match first.');
    const entries = approvedEntries_(t.id);
    const table = standings_(t, entries, groupMatches, results);
    let qualifiers = [];
    let extras = [];
    Object.keys(table).sort().forEach(function(g) {
      assert_(table[g].length >= t.qualifyPerGroup, 'Too many qualifiers per group.');
      qualifiers = qualifiers.concat(table[g].slice(0, t.qualifyPerGroup));
      if (table[g][t.qualifyPerGroup]) extras.push(table[g][t.qualifyPerGroup]);
    });
    // Best extra teams use points/game, goal difference/game, goals/game.
    extras.sort(function(a, b) {
      return b.points / Math.max(1, b.played) - a.points / Math.max(1, a.played) || b.goalDifference /
        Math.max(1, b.played) - a.goalDifference / Math.max(1, a.played) || b.goalsFor / Math.max(1, b
          .played) - a.goalsFor / Math.max(1, a.played) || a.lot - b.lot;
    });
    assert_(t.bestExtra <= extras.length, 'Not enough extra qualifiers.');
    qualifiers = qualifiers.concat(extras.slice(0, t.bestExtra));
    assert_(qualifiers.length >= 2, 'At least two qualifiers required.');
    const selected = qualifiers.map(function(r, i) {
      return Object.assign({}, entries.find(function(e) {
        return e.teamId === r.teamId;
      }), {
        seed: i + 1
      });
    });
    const plan = knockoutPlan_(t, selected, 'seeded');
    plan.forEach(function(m) {
      put_('Matches', m);
    });
    audit_('advance-groups', 'Tournaments', t.id, qualifiers, user.id);
    return {
      ok: true,
      count: plan.length
    };
  });
}

function saveMatch(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'matches');
    const t = tournamentAuth_(user, data.tournamentId);
    const old = data.id ? get_('Matches', data.id) : {};
    assert_(!old.id || old.tournamentId === t.id, 'Wrong tournament.');
    assert_(!old.id || !active_('Results').some(function(r) {
      return r.matchId === old.id && ['live', 'pending', 'approved'].indexOf(r.status) >= 0;
    }), 'Reject the result before changing its fixture.');
    const match = Object.assign({
        phase: t.format === 'knockout' ? 'knockout' : (t.format === 'groups' ? 'group' : 'league'),
        round: 1,
        group: '',
        status: 'scheduled',
        duration: t.duration,
        sourceA: '',
        sourceB: ''
      }, old,
      pick_(data, ['teamA', 'teamB', 'phase', 'group', 'round', 'venue', 'startAt', 'duration',
        'refereeId', 'status', 'specialOutcome', 'notes']), {
        tournamentId: t.id,
        sportId: t.sportId
      });
    assert_(['scheduled', 'postponed', 'cancelled', 'walkover', 'abandoned'].indexOf(match.status) >= 0,
      'Invalid match status.');
    if (['walkover', 'abandoned'].indexOf(match.status) >= 0) required_(match.specialOutcome, 1000);
    assert_(['league', 'group', 'knockout'].indexOf(match.phase) >= 0, 'Invalid phase.');
    assert_(!old.sourceA || match.teamA === old.teamA, 'Bracket participants come from source matches.');
    assert_(!old.sourceB || match.teamB === old.teamB, 'Bracket participants come from source matches.');
    if (!old.id || (!match.sourceA && !match.sourceB)) validateParticipants_(t, match.teamA, match.teamB);
    if (match.phase === 'group' && match.teamA && match.teamB) {
      const entries = approvedEntries_(t.id);
      const a = entries.find(function(e) {
        return e.teamId === match.teamA;
      });
      const b = entries.find(function(e) {
        return e.teamId === match.teamB;
      });
      assert_(a.group && a.group === b.group, 'Teams must be in the same group.');
      match.group = a.group;
    }
    match.duration = integer_(match.duration, 1, 480);
    match.round = integer_(match.round, 1, 1000);
    validateReferee_(match.refereeId);
    if (match.startAt) match.startAt = iso_(match.startAt);
    validateSlot_(match, t, active_('Matches'));
    put_('Matches', match);
    if (t.schedulePublished) notifyTeams_(match, 'Fixture updated: ' + t.name);
    audit_('save-fixture', 'Matches', match.id, {
      before: old,
      after: match
    }, user.id);
    return {
      ok: true,
      id: match.id
    };
  });
}

function autoSchedule(token, tournamentId) {
  return write_(function() {
    const user = auth_(token, false, 'matches');
    const t = tournamentAuth_(user, tournamentId);
    assert_(t.startDate && t.endDate, 'Set tournament start and end dates.');
    const existing = active_('Matches');
    const pending = existing.filter(function(m) {
      return m.tournamentId === t.id && !m.startAt && m.status !== 'cancelled';
    }).sort(function(a, b) {
      return (a.phase === 'knockout' ? 1 : 0) - (b.phase === 'knockout' ? 1 : 0) || a.round - b
        .round || a.id.localeCompare(b.id);
    });
    assert_(pending.length, 'No unscheduled fixtures.');
    assert_((new Date(t.endDate) - new Date(t.startDate)) / 86400000 <= 366,
      'Schedule window must be at most one year.');
    const planned = [];
    for (let i = 0; i < pending.length; i++) {
      const original = pending[i];
      let found = null;
      for (let day = new Date(t.startDate + 'T00:00:00Z'); day.toISOString().slice(0, 10) <= t.endDate &&
        !found; day.setUTCDate(day.getUTCDate() + 1)) {
        const date = day.toISOString().slice(0, 10);
        if (t.weekdays.indexOf(day.getUTCDay()) < 0 || t.blackoutDates.indexOf(date) >= 0) continue;
        for (let minute = minutes_(t.dayStart); minute + original.duration <= minutes_(t.dayEnd) && !
          found; minute += 5) {
          const time = ('0' + Math.floor(minute / 60)).slice(-2) + ':' + ('0' + minute % 60).slice(-2);
          for (let v = 0; v < t.venues.length && !found; v++) {
            const candidate = Object.assign({}, original, {
              startAt: iso_(date + 'T' + time + ':00+07:00'),
              venue: t.venues[v]
            });
            try {
              validateSlot_(candidate, t, existing.filter(function(m) {
                return !pending.some(function(p) {
                  return p.id === m.id;
                });
              }).concat(planned));
              found = candidate;
            } catch (error) {
              if (String(error.message).indexOf('SLOT:') !== 0) throw error;
            }
          }
        }
      }
      assert_(found,
        'No valid slot for all matches. Extend dates or add venues. No fixtures were changed.');
      planned.push(found);
    }
    planned.forEach(function(m) {
      put_('Matches', m);
      if (t.schedulePublished) notifyTeams_(m, 'Schedule assigned: ' + t.name);
    });
    audit_('auto-schedule', 'Tournaments', t.id, planned.map(function(m) {
      return {
        id: m.id,
        startAt: m.startAt,
        venue: m.venue
      };
    }), user.id);
    return {
      ok: true,
      count: planned.length
    };
  });
}

function submitResult(token, data) {
  return write_(function() { return submitResultData_(token,data); });
}
function submitResultData_(token,data) {
    const user = auth_(token, false, 'results');
    const match = get_('Matches', data.matchId);
    const t = get_('Tournaments', match.tournamentId);
    assert_(manages_(user, t) || (user.role === 'referee' && match.refereeId === user.id),
      'Only assigned referees or tournament managers submit results.');
    assert_(!match.archived && !t.archived, 'Match or tournament is archived.');
    assert_(match.teamA && match.teamB && match.status !== 'cancelled',
      'Match participants are not ready.');
    const old = active_('Results').find(function(r) {
      return r.matchId === match.id;
    });
    if (data.expectedLiveAt) assert_(old && old.status === 'live' && old.updatedAt === data.expectedLiveAt, 'Live data changed. Reopen the result form before finishing.');
    assert_(!old || old.status !== 'approved',
      'Reject the approved result with a reason before revising it.');
    const result = Object.assign({}, old || {}, pick_(data, ['scoreA', 'scoreB', 'extraA', 'extraB',
      'penaltyA', 'penaltyB', 'resultText', 'evidenceUrl', 'events', 'topScorerA', 'topScorerB', 'topScorerAId', 'topScorerBId', 'cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB', 'notes']), {
      matchId: match.id
    });
    ['scoreA', 'scoreB'].forEach(function(key) {
      result[key] = integer_(result[key], 0, 1000000);
    });
    ['extraA', 'extraB', 'penaltyA', 'penaltyB'].forEach(function(key) {
      result[key] = result[key] === '' || result[key] == null ? null : integer_(result[key], 0,
        1000000);
    });
    ['cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB'].forEach(key => {
      result[key] = result[key] === '' || result[key] == null ? null : integer_(result[key],0,key.indexOf('possession') === 0 ? 100 : 1000000);
    });
    assert_((result.possessionA == null && result.possessionB == null) ||
      (result.possessionA != null && result.possessionB != null && result.possessionA + result.possessionB === 100),
      'Possession percentages for A and B must total 100.');
    result.evidenceUrl = safeUrl_(result.evidenceUrl);
    assert_(Array.isArray(result.events || []) && (result.events || []).length <= 500,
      'Invalid match events.');
    const roster = active_('Players');
    const entries = active_('Entries');
    result.events = (result.events || []).map(function(event) {
      assert_(['goal', 'yellow', 'red'].indexOf(event.type) >= 0, 'Invalid event type.');
      const player = roster.find(function(p) {
        return p.id === event.playerId;
      });
      const entry = player && entries.find(function(e) {
        return e.id === player.entryId;
      });
      assert_(entry && entry.tournamentId === t.id && [match.teamA, match.teamB].indexOf(entry
        .teamId) >= 0, 'Event player is outside this match roster.');
      return {
        eventId: String(event.eventId || '').slice(0,100),
        type: event.type,
        playerId: player.id,
        teamId: entry.teamId,
        minute: integer_(event.minute || 0, 0, 1000)
      };
    });
    [match.teamA, match.teamB].forEach(function(teamId, i) {
      const recorded = result.events.filter(function(e) {
        return e.teamId === teamId && e.type === 'goal';
      }).length;
      assert_(recorded <= (i === 0 ? result.scoreA + Number(result.extraA || 0) : result.scoreB +
        Number(result.extraB || 0)), 'Goal events exceed the team score.');
    });
    ['A','B'].forEach(side => {
      const idKey = 'topScorer' + side + 'Id', nameKey = 'topScorer' + side;
      if (!Object.prototype.hasOwnProperty.call(data,idKey)) return; // preserve legacy text on older clients
      const id = String(data[idKey] || '');
      if (!id) {result[idKey]='';result[nameKey]='';return;}
      const player = roster.find(p => p.id === id), entry = player && entries.find(e => e.id === player.entryId);
      assert_(entry && entry.tournamentId === match.tournamentId && entry.teamId === match['team'+side],
        'Selected scorer is outside team ' + side + ' roster.');
      result[idKey] = player.id; result[nameKey] = player.name;
    });
    const live = data.live === true;
    assert_(!live || !old || old.status === 'live', 'Only a live result can be updated during play.');
    result.winnerId = live ? '' : resultWinner_(match, t, result);
    result.status = live ? 'live' : 'pending';
    result.verificationCode = newResultCode_();
    result.submittedBy = user.id;
    result.refereeName = required_(data.refereeName || user.name, 150);
    ['topScorerA', 'topScorerB'].forEach(function(key) {
      result[key] = String(result[key] || '').trim();
      assert_(result[key].length <= 150, 'Scorer name is too long.');
    });
    result.resultText = String(result.resultText || '').trim();
    result.notes = String(result.notes || '').trim();
    assert_(result.resultText.length <= 5000 && result.notes.length <= 5000,
      'Result details or notes are too long.');
    result.submittedAt = now_();
    result.confirmedBy = '';
    result.confirmedAt = '';
    result.rejectReason = '';
    result.certifierName = '';
    // Keep the preceding return-for-correction metadata; audit preserves each full revision.
    put_('Results', result);
    match.status = live ? 'live' : 'awaiting_confirmation';put_('Matches',match);
    if(!live) pauseMatchClock_(match.id);
    if (!live) notifyManagers_(t, 'Result awaiting confirmation: ' + match.id);
    audit_('submit-result', 'Results', result.id, {
      before: old || null,
      after: result
    }, user.id);
    return {
      ok: true,
      id: result.id,
      verificationCode: result.verificationCode
    };
}

function approveResult(token, resultId, certifierName) {
  return write_(function() {
    const user = auth_(token, false, 'resultApprovals');
    const result = get_('Results', resultId);
    const match = get_('Matches', result.matchId);
    const t = tournamentAuth_(user, match.tournamentId);
    assert_(result.status === 'pending', 'Only pending results can be approved.');
    result.winnerId = resultWinner_(match, t, result);
    result.certifierName = required_(certifierName, 150);
    result.status = 'approved';
    result.confirmedBy = user.id;
    result.confirmedAt = now_();
    put_('Results', result);
    if (['walkover', 'abandoned'].indexOf(match.status) < 0) put_('Matches', Object.assign(match, {
      status: 'completed'
    }));
    advanceKnockout_(match, result.winnerId);
    notifyTeams_(match, 'Result confirmed: ' + t.name);
    audit_('approve-result', 'Results', result.id, {
      result: result
    }, user.id);
    return {
      ok: true,
      verificationUrl: verificationUrl_(result.verificationCode)
    };
  });
}

function rejectResult(token, resultId, reason, reviewerName) {
  return write_(function() {
    const user = auth_(token, false, 'resultApprovals');
    const result = get_('Results', resultId);
    const match = get_('Matches', result.matchId);
    tournamentAuth_(user, match.tournamentId);
    const note = required_(reason, 1000);
    const reviewer = required_(reviewerName, 150);
    assert_(['live', 'pending', 'approved'].indexOf(result.status) >= 0,
      'Result is not awaiting review or certification.');
    const descendants = descendantMatches_(match.id);
    const results = active_('Results');
    assert_(!descendants.some(function(m) {
      return results.some(function(r) {
        return r.matchId === m.id && ['approved', 'pending'].indexOf(r.status) >= 0;
      });
    }), 'Reject downstream results first, starting with the final.');
    // Withdraw propagated participants throughout the dependent bracket.
    descendants.forEach(function(m) {
      const sourceIds = [match.id].concat(descendants.map(function(d) {
        return d.id;
      }));
      if (sourceIds.indexOf(m.sourceA) >= 0) m.teamA = '';
      if (sourceIds.indexOf(m.sourceB) >= 0) m.teamB = '';
      if (['completed','awaiting_confirmation'].indexOf(m.status) >= 0) m.status = 'scheduled';
      put_('Matches', m);
    });
    const before = Object.assign({}, result);
    put_('Results', Object.assign(result, {
      status: 'revision',
      rejectReason: note,
      reviewerName: reviewer,
      reviewedBy: user.id,
      reviewedAt: now_(),
      confirmedBy: '',
      confirmedAt: '',
      certifierName: ''
    }));
    if (match.status === 'completed') put_('Matches', Object.assign(match, {
      status: 'scheduled'
    }));
    notify_(result.submittedBy, 'Result rejected: ' + note);
    notifyTeams_(match, 'Result withdrawn: ' + note);
    audit_('reject-result', 'Results', result.id, {
      before: before,
      reason: note,
      reviewerName: reviewer
    }, user.id);
    return {
      ok: true
    };
  });
}

function saveMedalAward(token, data) {
  return write_(function() {
    const user = auth_(token, false, 'medals');
    const t = tournamentAuth_(user, data.tournamentId);
    const old = data.id ? get_('Medals', data.id) : {};
    assert_(!old.id || old.tournamentId === t.id, 'Wrong tournament.');
    const medal = Object.assign({}, old, pick_(data, ['goldTeamId', 'silverTeamId', 'bronzeTeamId',
      'status']), {
      tournamentId: t.id,
      sportId: t.sportId
    });
    const ids = [medal.goldTeamId, medal.silverTeamId, medal.bronzeTeamId].filter(Boolean);
    assert_(ids.length && new Set(ids).size === ids.length, 'Medal teams must be distinct.');
    const valid = approvedEntries_(t.id).map(function(e) {
      return e.teamId;
    });
    assert_(ids.every(function(id) {
      return valid.indexOf(id) >= 0;
    }), 'Medal team is not approved.');
    assert_(['draft', 'approved'].indexOf(medal.status) >= 0, 'Invalid medal status.');
    assert_(!active_('Medals').some(function(m) {
      return m.tournamentId === t.id && m.id !== old.id;
    }), 'Edit the existing medal award.');
    put_('Medals', medal);
    audit_('medals', 'Medals', medal.id, {
      before: old,
      after: medal
    }, user.id);
    return {
      ok: true
    };
  });
}

function verifyResultCode(code) {
  ready_();
  const key = String(code || '').trim().toUpperCase();
  const result = active_('Results').find(function(r) {
    return r.verificationCode === key && r.status === 'approved';
  });
  if (!result) return {
    valid: false
  };
  const match = get_('Matches', result.matchId);
  const t = get_('Tournaments', match.tournamentId);
  if (t.archived || match.archived || !t.published || !t.schedulePublished) return {
    valid: false
  };
  return {
    valid: true,
    result: publicResult_(result),
    match: publicMatch_(match),
    tournament: publicTournament_(t),
    teamA: publicTeam_(get_('Teams', match.teamA)),
    teamB: publicTeam_(get_('Teams', match.teamB)),
    url: verificationUrl_(key)
  };
}

const DELETE_MODULES_ = {Sports:'sports',Tournaments:'tournaments',Teams:'teams',Entries:'entries',Players:'players',PlayerTransfers:'players',RosterRequests:'rosterRequests',Matches:'matches',Results:'results',Medals:'medals',Users:'users',PasswordRequests:'passwordRequests',Notifications:'notifications',StatAdjustments:'results',StandingsAdjustments:'results'};
function deletionActor_(token,table,readOnly) {
  assert_(Object.prototype.hasOwnProperty.call(DELETE_MODULES_,table),'Deletion is not supported for this table.');
  const actor=auth_(token,readOnly,DELETE_MODULES_[table]);
  assert_(competitionAdmin_(actor),'Only Super Admin or Admin staff can delete records.');
  return actor;
}
function deletionRestriction_(actor,table,record) {
  if (table === 'Users') {
    if (record.id === 'ADMIN' || record.role === 'admin' || record.id === actor.id) return 'ບໍ່ສາມາດລົບ Super Admin ຫຼືບັນຊີຕົນເອງ.';
    if (actor.role !== 'admin' && record.role === 'operator') return 'Only Super Admin can delete Admin staff accounts.';
    if (!record.disabled && !record.archived) return 'ກະລຸນາປິດການໃຊ້ງານບັນຊີກ່ອນລົບ.';
  }
  if (table === 'Notifications' && actor.role !== 'admin' && record.userId !== actor.id) return 'ລົບໄດ້ສະເພາະແຈ້ງເຕືອນຂອງຕົນເອງ.';
  return '';
}
function deletionReferences_(table,record) {
  const rules={
    Sports:{Tournaments:['sportId'],Matches:['sportId'],Medals:['sportId']},
    Tournaments:{Users:['tournamentId'],Entries:['tournamentId'],Matches:['tournamentId'],PlayerTransfers:['tournamentId'],Medals:['tournamentId'],StatAdjustments:['tournamentId'],StandingsAdjustments:['tournamentId']},
    Teams:{Entries:['teamId'],Matches:['teamA','teamB'],Medals:['goldTeamId','silverTeamId','bronzeTeamId'],StatAdjustments:['teamId'],StandingsAdjustments:['teamId']},
    Entries:{Players:['entryId'],PlayerTransfers:['fromEntryId','toEntryId'],RosterRequests:['entryId'],StandingsAdjustments:['entryId']},
    Players:{Results:['topScorerAId','topScorerBId'],PlayerTransfers:['playerId'],RosterRequests:['playerId'],StatAdjustments:['playerId']},
    Matches:{Results:['matchId'],Matches:['sourceA','sourceB']},
    Users:{Tournaments:['createdBy'],Teams:['ownerId','reviewedBy'],Players:['reviewedBy'],Matches:['refereeId'],Results:['submittedBy','confirmedBy','reviewedBy'],PlayerTransfers:['requestedBy','acceptedBy','reviewedBy','acceptedTeamOwnerId'],RosterRequests:['requestedBy','reviewedBy'],StatAdjustments:['updatedBy'],StandingsAdjustments:['updatedBy'],PasswordRequests:['userId','reviewedBy'],Notifications:['userId']}
  }[table] || {};
  const refs=[];
  Object.keys(rules).forEach(target=>{
    const matches=rows_(target).filter(row=>!(target === table && row.id === record.id) && rules[target].some(key=>row[key] === record.id));
    if(matches.length) refs.push({table:target,count:matches.length});
  });
  if(table === 'Players') {
    const count=rows_('Results').filter(row=>(row.events || []).some(event=>event.playerId === record.id)).length;
    if(count && !refs.some(ref=>ref.table === 'Results')) refs.push({table:'Results',count:count});
  }
  if(table === 'Users') {
    const count=rows_('Tournaments').filter(row=>(row.managerIds || []).includes(record.id)).length;
    if(count) refs.push({table:'Tournaments',count:count});
  }
  if(table === 'Results' || table === 'Matches' || table === 'StandingsAdjustments') {
    const match=table === 'Matches' ? record : (table === 'Results' ? rows_('Matches').find(m=>m.id === record.matchId) : null);
    if(table === 'StandingsAdjustments') {
      const count=rows_('Matches').filter(m=>m.tournamentId === record.tournamentId && m.phase === 'knockout').length;
      if(count) refs.push({table:'Matches',count:count});
    }
    if(match) {
      const tournament=get_('Tournaments',match.tournamentId);
      const count=rows_('Matches').filter(m=>m.id !== match.id && (m.sourceA === match.id || m.sourceB === match.id || (tournament.format === 'groups' && match.phase !== 'knockout' && m.tournamentId === tournament.id && m.phase === 'knockout'))).length;
      if(count) refs.push({table:'Matches',count:count});
    }
  }
  return refs;
}
function deletionLabel_(table,r) {
  if (r.name) return (r.accountCode || r.playerCode || '')+' '+r.name;
  const title=(table,id)=>{const row=rows_(table).find(row=>row.id === id);return row ? (row.name || row.accountCode || row.playerCode || id) : '—';};
  if (table === 'StatAdjustments') return title('Players',r.playerId)+' · '+title('Teams',r.teamId)+' · '+title('Tournaments',r.tournamentId);
  if (table === 'StandingsAdjustments') return title('Teams',r.teamId)+' · '+title('Tournaments',r.tournamentId);
  if (table === 'Medals') return title('Tournaments',r.tournamentId)+' · '+r.status;
  if (table === 'PasswordRequests') return title('Users',r.userId)+' · '+r.status+' · '+String(r.reason || '').slice(0,80);
  if (table === 'PlayerTransfers') return (r.playerCode || '')+' '+(r.playerName || title('Players',r.playerId))+' · '+r.status;
  if (table === 'RosterRequests') return (r.playerCode || '')+' '+(r.payload?.name || title('Players',r.playerId))+' · '+r.status;
  if (table === 'Notifications') return String(r.message || '').slice(0,100);
  if (table === 'Entries') return get_('Teams',r.teamId).name+' · '+get_('Tournaments',r.tournamentId).name;
  if (table === 'Results') return deletionLabel_('Matches',get_('Matches',r.matchId))+' · '+r.scoreA+':'+r.scoreB;
  if (table === 'Matches') return get_('Tournaments',r.tournamentId).name+' · '+(rows_('Teams').find(t=>t.id === r.teamA)?.name || '—')+' vs '+(rows_('Teams').find(t=>t.id === r.teamB)?.name || '—');
  return [r.playerCode,r.playerName,r.status,r.reason || r.note,r.tournamentId,r.id].filter(Boolean).join(' · ').slice(0,220);
}
function getDeletionOptions(token,table,tournamentId) {
  const actor=deletionActor_(token,table,true);
  return rows_(table).filter(r=>table !== 'Notifications' || actor.role === 'admin' || r.userId === actor.id).filter(r=>{
    if(!tournamentId || table === 'Users' || table === 'Sports' || table === 'Notifications' || table === 'PasswordRequests') return true;
    if(table === 'Tournaments') return r.id === tournamentId;
    if(table === 'Teams') return rows_('Entries').some(e=>e.teamId === r.id && e.tournamentId === tournamentId);
    const entry=r.entryId && rows_('Entries').find(e=>e.id === r.entryId), match=r.matchId && rows_('Matches').find(m=>m.id === r.matchId);
    return (r.tournamentId || entry?.tournamentId || match?.tournamentId) === tournamentId;
  }).map(r=>({id:r.id,label:deletionLabel_(table,r).trim(),archived:!!r.archived,stamp:digest_(JSON.stringify(r)),restriction:deletionRestriction_(actor,table,r),references:deletionReferences_(table,r)}));
}
function deleteManagedRecord(token,data) {
  return write_(function() {
    const actor=deletionActor_(token,data.table,false),record=get_(data.table,data.id);
    assert_(data.confirmed === true,'ກະລຸນາຢືນຢັນລາຍການທີ່ຈະລົບ.');
    const reason=required_(data.reason,1000), restriction=deletionRestriction_(actor,data.table,record);
    assert_(!restriction,restriction);
    assert_(data.stamp === digest_(JSON.stringify(record)),'ຂໍ້ມູນປ່ຽນແປງແລ້ວ ກະລຸນາເປີດຟອມລົບໃໝ່.');
    const references=deletionReferences_(data.table,record);
    assert_(!references.length,'ລົບບໍ່ໄດ້ ຍັງມີຂໍ້ມູນອ້າງອີງ: '+references.map(ref=>ref.table+' ('+ref.count+')').join(', ')+'. ກະລຸນາຈັດການລາຍການທີ່ອ້າງອີງກ່ອນ.');
    const before=data.table === 'Users' ? safeUser_(record) : record;
    removeManagedRow_(data.table,record.id);
    if(data.table === 'Matches') { if(rows_('MatchClocks').some(r=>r.id === record.id)) removeManagedRow_('MatchClocks',record.id); }
    if(data.table === 'Results') {
      const match=rows_('Matches').find(m=>m.id === record.matchId);
      if(match && !active_('Results').some(r=>r.matchId === match.id && ['approved','pending','live'].includes(r.status))) {
        match.status='scheduled';put_('Matches',match);
        if(rows_('MatchClocks').some(r=>r.id === match.id)) removeManagedRow_('MatchClocks',match.id);
      }
    }
    if(data.table === 'Users') {
      rows_('Tokens').filter(row=>row.userId === record.id).forEach(row=>removeManagedRow_('Tokens',row.id));
      PropertiesService.getScriptProperties().setProperty('ACCOUNT_PASSWORD:'+SHEET_ID+':'+record.id,'');
    }
    audit_('delete-record',data.table,record.id,{before:before,reason:reason},actor.id);
    return {ok:true};
  });
}
function removeManagedRow_(table,id) {
  const sheet=sheet_(table),values=sheet.getDataRange().getValues();
  const index=values.findIndex((row,i)=>i>0 && String(row[0]) === id);
  assert_(index>0,'Record not found.');sheet.deleteRow(index+1);delete READ_CACHE_[table];
}

function deleteSport(token,data) {
  return write_(function() {
    const user = auth_(token,false,'sports');
    assert_(competitionAdmin_(user),'Only Super Admin or Admin staff can delete sports.');
    const sport = get_('Sports',data.id);
    assert_(String(data.confirmName || '').trim() === sport.name,'ກະລຸນາພິມຊື່ກິລາໃຫ້ຖືກຕ້ອງເພື່ອຢືນຢັນລົບ.');
    const reason = required_(data.reason,1000);
    const linked = rows_('Tournaments').filter(t => t.sportId === sport.id);
    assert_(!linked.length,'ລົບບໍ່ໄດ້: ກິລານີ້ຖືກໃຊ້ໃນລາຍການແຂ່ງ: '+linked.map(t => t.name).join(', ')+'. ສາມາດເກັບເຂົ້າປະຫວັດແທນໄດ້ເມື່ອບໍ່ມີລາຍການທີ່ໃຊ້ງານ.');
    assert_(!rows_('Matches').some(m => m.sportId === sport.id),'ລົບບໍ່ໄດ້: ກິລານີ້ມີປະຫວັດຕາຕະລາງແຂ່ງ.');
    const sheet = sheet_('Sports'), values = sheet.getDataRange().getValues();
    const index = values.findIndex((row,i) => i > 0 && String(row[0]) === sport.id);
    assert_(index > 0,'Sport not found.');
    sheet.deleteRow(index+1);
    delete READ_CACHE_.Sports;
    audit_('delete-sport','Sports',sport.id,{before:sport,reason:reason},user.id);
    return {ok:true};
  });
}

function archiveRecord(token, table, recordId, restore) {
  return write_(function() {
    const user = auth_(token, false, {
      Sports: 'sports',
      Tournaments: 'tournaments',
      Teams: 'teams',
      Entries: 'entries',
      Players: 'players',
      Matches: 'matches'
    } [table] || 'invalid');
    assert_(['Sports', 'Tournaments', 'Teams', 'Entries', 'Players', 'Matches'].indexOf(table) >= 0,
      'Archive not supported.');
    const record = get_(table, recordId);
    if (table === 'Players') assert_(record.status !== 'approved',
      'Return the approved player before archiving or restoring.');
    if (table === 'Entries') assert_(record.status !== 'approved',
      'Return the approved registration before archiving or restoring.');
    if (table === 'Players') assert_(get_('Entries', record.entryId).status !== 'approved',
      'Return the approved registration before changing its roster.');
    if (table === 'Teams') assert_(record.status !== 'approved',
      'Return the approved team for correction before archiving or restoring.');
    if (restore) {
      assert_(user.role === 'admin', 'Only Super Admin can restore archived records.');
    } else if (table === 'Players') {
      const entry = get_('Entries', record.entryId);
      const t = get_('Tournaments', entry.tournamentId);
      assert_(manages_(user, t) || (owns_(user, get_('Teams', entry.teamId)) && (!t.rosterDeadline || Date
          .now() <= new Date(t.rosterDeadline).getTime())),
        'Roster closed; ask the manager to remove this player.');
      assert_(!active_('Results').some(function(r) {
        return (r.events || []).some(function(e) {
          return e.playerId === recordId;
        });
      }), 'Player has match history.');
      if (!manages_(user, t) && entry.status === 'approved') put_('Entries', Object.assign(entry, {
        status: 'pending'
      }));
    } else if (table === 'Teams') {
      assert_(owns_(user, record), 'Not your team.');
      assert_(!active_('Entries').some(function(e) {
        return e.teamId === recordId;
      }), 'Archive team registrations first.');
    } else if (table === 'Sports') {
      assert_(competitionAdmin_(user), 'Admin permission required.');
      assert_(!active_('Tournaments').some(function(t) {
        return t.sportId === recordId;
      }), 'Sport has active tournaments.');
    } else if (table === 'Tournaments') {
      assert_(competitionAdmin_(user), 'Admin permission required.');
    } else {
      tournamentAuth_(user, record.tournamentId);
      if (table === 'Entries') assert_(!active_('Matches').some(function(m) {
        return m.tournamentId === record.tournamentId && [m.teamA, m.teamB].indexOf(record
          .teamId) >= 0;
      }), 'Team has fixtures.');
      if (table === 'Matches') {
        assert_(!active_('Results').some(function(r) {
          return r.matchId === recordId && ['live', 'pending', 'approved'].indexOf(r.status) >= 0;
        }), 'Reject its result first.');
        assert_(!active_('Matches').some(function(m) {
          return m.sourceA === recordId || m.sourceB === recordId;
        }), 'Archive dependent rounds first, starting with the final.');
      }
    }
    if (restore) validateRestore_(table, record);
    put_(table, Object.assign(record, {
      archived: !restore
    }));
    audit_(restore ? 'restore' : 'archive', table, recordId, {}, user.id);
    return {
      ok: true
    };
  });
}

function getArchivedData(token) {
  const user = auth_(token, false, 'settings');
  assert_(user.role === 'admin', 'Super Admin only.');
  const output = {};
  ['Sports', 'Tournaments', 'Teams', 'Entries', 'Players', 'Matches'].forEach(function(table) {
    output[table] = rows_(table).filter(function(r) {
      return r.archived;
    });
  });
  return output;
}

function markNotificationsRead(token) {
  return write_(function() {
    const user = auth_(token, false, 'notifications');
    rows_('Notifications').filter(function(n) {
      return n.userId === user.id && !n.read;
    }).forEach(function(n) {
      put_('Notifications', Object.assign(n, {
        read: true
      }));
    });
    return {
      ok: true
    };
  });
}

function exportData(token, table, format) {
  const user = auth_(token, false, 'settings');
  assert_(user.role === 'admin', 'Super Admin only.');
  assert_(SCHEMA[table] && ['json', 'csv'].indexOf(format) >= 0, 'Invalid export.');
  // User credentials and email-reset tokens are never exported.
  assert_(['Users', 'Tokens'].indexOf(table) < 0, 'Credential tables cannot be exported.');
  const data = rows_(table);
  const content = format === 'json' ? JSON.stringify(data, null, 2) : '\uFEFF' + [SCHEMA[table]].concat(data
    .map(function(r) {
      return SCHEMA[table].map(function(k) {
        return typeof r[k] === 'object' ? JSON.stringify(r[k]) : r[k];
      });
    })).map(function(row) {
    return row.map(function(v) {
      let s = String(v == null ? '' : v);
      if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    }).join(',');
  }).join('\r\n');
  return {
    name: 'ADDY-' + table + '-' + now_().slice(0, 10) + '.' + format,
    content: content,
    mime: format === 'json' ? 'application/json' : 'text/csv'
  };
}

function createBackup(token) {
  return write_(function() {
    const user = auth_(token, false, 'settings');
    assert_(user.role === 'admin', 'Super Admin only.');
    const file = DriveApp.getFileById(SHEET_ID).makeCopy('ADDY SPORT backup ' + now_(), DriveApp
      .getFolderById(PropertiesService.getScriptProperties().getProperty('UPLOAD_FOLDER_ID')));
    audit_('backup', 'System', file.getId(), {}, user.id);
    return {
      ok: true,
      url: file.getUrl()
    };
  });
}

function getDatabaseInfo(token) {
  const user = auth_(token, false, 'settings');
  assert_(user.role === 'admin', 'Super Admin only.');
  return {
    sheetId: SHEET_ID,
    sheetUrl: 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit',
    webAppUrl: WEB_APP_URL,
    schema: APP.schemaVersion,
    timezone: APP.timezone,
    counts: Object.keys(SCHEMA).map(function(name) {
      return {
        table: name,
        count: rows_(name).length
      };
    })
  };
}

function createDemoData(token) {
  return write_(function() {
    const user = auth_(token, false, 'settings');
    assert_(user.role === 'admin', 'Super Admin only.');
    assert_(!rows_('Tournaments').some(function(t) {
      return t.demo;
    }), 'Demo already exists. Clear it first.');
    ['Football', 'Futsal', 'Basketball', 'Volleyball'].forEach(function(name, i) {
      put_('Sports', {
        id: 'DYT-S' + i,
        name: name,
        category: 'Open',
        gender: 'Mixed',
        type: 'team',
        scoringRules: {
          mode: 'points'
        },
        demo: true
      });
    });
    const t = {
      id: 'DYT-T',
      name: 'ADDY Demo Cup',
      sportId: 'DYT-S0',
      format: 'league',
      legs: 1,
      groupCount: 2,
      qualifyPerGroup: 2,
      bestExtra: 0,
      pointsWin: 3,
      pointsDraw: 1,
      pointsLoss: 0,
      tiebreakers: ['goalDifference', 'goalsFor', 'headToHead', 'fairPlay', 'lot'],
      tieRule: 'penalties',
      minPlayers: 1,
      maxPlayers: 30,
      playersOnField: 11,
      allowDuplicate: false,
      managerIds: [],
      startDate: '2026-11-08',
      endDate: '2026-11-30',
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      dayStart: '08:00',
      dayEnd: '18:00',
      duration: 60,
      breakMinutes: 10,
      minRest: 60,
      venues: ['Demo Stadium'],
      blackoutDates: [],
      published: true,
      schedulePublished: true,
      demo: true
    };
    put_('Tournaments', t);
    const ids = [];
    ['KPS United', 'Vientiane FC', 'Mekong City', 'Lan Xang'].forEach(function(name, i) {
      const teamId = 'DYT-TEAM' + i;
      ids.push(teamId);
      put_('Teams', {
        id: teamId,
        name: name,
        school: 'Demo School ' + (i + 1),
        shortName: name.slice(0, 3),
        color: '#14a578',
        contactName: 'Demo',
        phone: '02000000000',
        coach: 'Demo Coach',
        ownerId: 'ADMIN',
        demo: true
      });
      put_('Entries', {
        id: 'DYT-E' + i,
        tournamentId: t.id,
        teamId: teamId,
        status: 'approved',
        group: '',
        seed: i + 1,
        pot: 0,
        lot: i / 10,
        demo: true
      });
      put_('Players', {
        id: 'DYT-P' + i,
        entryId: 'DYT-E' + i,
        name: 'Demo Player ' + (i + 1),
        identityKey: 'demo-' + i,
        jersey: i + 7,
        verified: true,
        demo: true
      });
    });
    const plan = leaguePlan_(t, ids, '');
    plan.forEach(function(m, i) {
      m.id = 'DYT-M' + i;
      m.demo = true;
      m.startAt = '2026-11-' + (10 + i) + 'T01:00:00.000Z';
      m.venue = 'Demo Stadium';
      m.status = i < 3 ? 'completed' : 'scheduled';
      put_('Matches', m);
      if (i < 4) {
        const player = rows_('Players').find(function(p) {
          return rows_('Entries').some(function(e) {
            return e.id === p.entryId && e.teamId === m.teamA;
          });
        });
        put_('Results', {
          id: 'DYT-R' + i,
          matchId: m.id,
          scoreA: i + 1,
          scoreB: i % 2,
          winnerId: m.teamA,
          resultText: 'Demonstration',
          refereeName: 'Demo referee',
          events: [{
            type: 'goal',
            playerId: player.id,
            teamId: m.teamA,
            minute: 12
          }],
          status: i < 3 ? 'approved' : 'pending',
          verificationCode: 'DYT-CODE' + i,
          submittedBy: 'ADMIN',
          submittedAt: now_(),
          confirmedBy: i < 3 ? 'ADMIN' : '',
          confirmedAt: i < 3 ? now_() : '',
          demo: true
        });
      }
    });
    put_('Medals', {
      id: 'DYT-MEDAL',
      tournamentId: t.id,
      sportId: t.sportId,
      goldTeamId: ids[0],
      silverTeamId: ids[1],
      bronzeTeamId: ids[2],
      status: 'approved',
      demo: true
    });
    audit_('demo-create', 'System', 'DYT', {}, user.id);
    return {
      ok: true,
      message: 'Created 4 sports, 4 teams, 4 players, 6 matches and sample results/medals.'
    };
  });
}

function clearDemoData(token) {
  return write_(function() {
    const user = auth_(token, false, 'settings');
    assert_(user.role === 'admin', 'Super Admin only.');
    const targets = {};
    Object.keys(SCHEMA).filter(function(name) {
      return ['Audit', 'Settings', 'Users', 'Tokens', 'Notifications', 'PasswordRequests'].indexOf(
        name) < 0;
    }).forEach(function(table) {
      targets[table] = rows_(table).filter(function(r) {
        return r.demo === true && String(r.id).indexOf('DYT-') === 0;
      });
    });
    const demoIds = new Set([].concat.apply([], Object.keys(targets).map(function(k) {
      return targets[k].map(function(r) {
        return r.id;
      });
    })));
    const references = ['sportId', 'tournamentId', 'teamId', 'entryId', 'matchId', 'teamA', 'teamB',
      'sourceA', 'sourceB', 'winnerId', 'goldTeamId', 'silverTeamId', 'bronzeTeamId', 'playerId'];
    Object.keys(targets).forEach(function(table) {
      rows_(table).filter(function(r) {
        return !demoIds.has(r.id);
      }).forEach(function(record) {
        assert_(!references.some(function(key) {
            return demoIds.has(record[key]);
          }) && !(record.events || []).some(function(e) {
            return demoIds.has(e.playerId) || demoIds.has(e.teamId);
          }),
          'Real records reference demo data. Archive or update those references before clearing demo data.'
        );
      });
    });
    let count = 0;
    Object.keys(targets).forEach(function(table) {
      delete READ_CACHE_[table];
      const ids = new Set(targets[table].map(function(r) {
        return r.id;
      }));
      const sheet = sheet_(table);
      const values = sheet.getDataRange().getValues();
      for (let row = values.length - 1; row >= 1; row--) {
        if (ids.has(String(values[row][0]))) {
          sheet.deleteRow(row + 1);
          count++;
        }
      }
    });
    audit_('demo-clear', 'System', 'DYT', {
      count: count
    }, user.id);
    return {
      ok: true,
      count: count
    };
  });
}

// ---------------- Persistence and security helpers (private) ----------------
function ready_() {
  assert_(PropertiesService.getScriptProperties().getProperty('SCHEMA_READY') === APP.schemaVersion,
    'Run setupSystem() from the Apps Script editor to install or upgrade. Existing data will be preserved.');
}

function sheet_(name) {
  assert_(Object.prototype.hasOwnProperty.call(SCHEMA, name), 'Unknown table.');
  if (!BOOK_CACHE_) BOOK_CACHE_ = SpreadsheetApp.openById(SHEET_ID);
  const sheet = BOOK_CACHE_.getSheetByName(name);
  assert_(sheet, 'Missing sheet: ' + name + '. Run setupSystem().');
  return sheet;
}

function rows_(name) {
  if (READ_CACHE_[name]) return JSON.parse(JSON.stringify(READ_CACHE_[name]));
  const values = sheet_(name).getDataRange().getValues();
  const headers = SCHEMA[name];
  const records = values.slice(1).filter(function(row) {
    return row[0] !== '';
  }).map(function(row) {
    const record = {};
    headers.forEach(function(key, i) {
      let value = row[i];
      if (value instanceof Date) value = value.toISOString();
      if (JSON_FIELDS.indexOf(key) >= 0) {
        value = value ? JSON.parse(String(value)) : (key === 'details' || key === 'scoringRules' ||
          key === 'payload' || key === 'moduleAccess' ? {} : []);
      } else if (BOOL_FIELDS.indexOf(key) >= 0) {
        value = value === true || value === 'true';
      } else if (NUMBER_FIELDS.indexOf(key) >= 0) {
        value = value === '' ? null : Number(value);
      } else {
        value = String(value == null ? '' : value);
        // Leading apostrophe is used to stop formula injection on text writes.
        if (value.indexOf("'=") === 0 || value.indexOf("'+") === 0 || value.indexOf("'-") === 0 ||
          value.indexOf("'@") === 0) value = value.slice(1);
      }
      record[key] = value;
    });
    return record;
  });
  READ_CACHE_[name] = records;
  return JSON.parse(JSON.stringify(records));
}

function active_(name) {
  let records = rows_(name).filter(function(r) {
    return !r.archived;
  });
  const relationships = {
    Tournaments: [['sportId', 'Sports']],
    Entries: [['teamId', 'Teams'], ['tournamentId', 'Tournaments']],
    Players: [['entryId', 'Entries']],
    RosterRequests: [['entryId', 'Entries']],
    Matches: [['tournamentId', 'Tournaments']],
    Results: [['matchId', 'Matches']],
    Medals: [['tournamentId', 'Tournaments']]
  };
  (relationships[name] || []).forEach(function(relation) {
    const parents = new Set(active_(relation[1]).map(function(r) {
      return r.id;
    }));
    records = records.filter(function(r) {
      return parents.has(r[relation[0]]);
    });
  });
  return records;
}

function get_(name, id) {
  const record = rows_(name).find(function(r) {
    return r.id === id;
  });
  assert_(record, name + ' record not found.');
  return record;
}

/** Must only be called inside write_(). */
function put_(name, record, preserveUpdatedAt) {
  if (name === 'Users') ensureAccountCode_(record);
  if (name === 'Players') ensurePlayerCode_(record);
  delete READ_CACHE_[name];
  const sheet = sheet_(name);
  const headers = SCHEMA[name];
  const values = sheet.getDataRange().getValues();
  if (!record.id) record.id = id_();
  const index = values.findIndex(function(row, i) {
    return i > 0 && String(row[0]) === record.id;
  });
  if (headers.indexOf('createdAt') >= 0) record.createdAt = record.createdAt || now_();
  record.updatedAt = preserveUpdatedAt ? (record.updatedAt || now_()) : now_();
  const row = headers.map(function(key) {
    let value = record[key];
    if (value == null) return '';
    if (JSON_FIELDS.indexOf(key) >= 0) value = JSON.stringify(value);
    if (typeof value === 'string' && /^[=+@\-\t\r]/.test(value)) value = "'" + value;
    return value;
  });
  sheet.getRange(index > 0 ? index + 1 : values.length + 1, 1, 1, headers.length).setValues([row]);
  return record;
}

function write_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const result = fn();
    SpreadsheetApp.flush();
    return result;
  } finally {
    lock.releaseLock();
  }
}

function auth_(token, allowReadOnly, moduleKey) {
  ready_();
  const session = CacheService.getScriptCache().get('session:' + digest_(String(token || '')));
  assert_(session, 'SESSION_EXPIRED: Please login again.');
  const data = JSON.parse(session);
  const user = get_('Users', data.id);
  assert_(!user.disabled && !user.archived && user.verified && user.authVersion === data.version && (user.id !== 'ADMIN' || data
    .adminKey === digest_(ADMIN_PASSWORD)), 'SESSION_EXPIRED: Please login again.');
  const level = accessLevel_(user);
  assert_(level !== 'none', 'ACCESS_DENIED: Super Admin has not granted access.');
  assert_(allowReadOnly === true || level === 'edit', 'READ_ONLY: Super Admin granted view-only access.');
  if (moduleKey) {
    const mode = moduleAccess_(user, moduleKey);
    assert_(mode !== 'none', 'MODULE_ACCESS_DENIED: No access to ' + moduleKey);
    assert_(allowReadOnly === true || mode === 'edit', 'READ_ONLY: View-only permission for ' + moduleKey);
  }
  return user;
}

function competitionAdmin_(user) {
  return user.role === 'admin' || user.role === 'operator';
}

function manages_(user, tournament) {
  return !tournament.archived && (competitionAdmin_(user) || (user.role === 'assistant' && user.tournamentId === tournament.id) || (user.role === 'manager' && (tournament.createdBy === user.id || (tournament.managerIds || []).indexOf(user.id) >= 0)));
}

function canReviewTournament_(user,tournament) {
  return !tournament.archived && (competitionAdmin_(user) || (user.role === 'assistant' && user.tournamentId === tournament.id) || (user.role === 'manager' && tournament.createdBy === user.id));
}
function assertTournamentReviewer_(user,tournament) {
  assert_(canReviewTournament_(user,tournament),'Only Super Admin, Admin staff or the manager who created this competition may review its registrations and athletes.');
}

function tournamentAuth_(user, id) {
  const t = get_('Tournaments', id);
  assert_(manages_(user, t), 'No permission for this tournament.');
  return t;
}

function owns_(user, team) {
  return !team.archived && (competitionAdmin_(user) || (user.role === 'captain' && team.ownerId === user.id));
}

/** Menu-level permissions are a ceiling within the user's existing role scope. */
function roleModules_(user) {
  const roles = {
    admin: ['tournaments', 'teams', 'entries', 'players', 'rosterRequests', 'matches', 'results',
      'resultApprovals', 'medals', 'sports', 'users', 'passwordRequests', 'notifications', 'audit',
      'settings'],
    operator: ['tournaments', 'teams', 'entries', 'players', 'rosterRequests', 'matches', 'results',
      'resultApprovals', 'medals', 'sports', 'users', 'notifications'],
    assistant: ['tournaments','entries','players','rosterRequests','matches','results','resultApprovals','notifications'],
    manager: ['tournaments', 'entries', 'players', 'rosterRequests', 'matches', 'results',
      'resultApprovals', 'medals', 'notifications'],
    referee: ['matches', 'results', 'notifications'],
    captain: ['teams', 'entries', 'players', 'rosterRequests', 'notifications']
  };
  return roles[user.role] || [];
}

function validateModuleAccess_(user, value) {
  assert_(value && typeof value === 'object' && !Array.isArray(value), 'Invalid module permissions.');
  const allowed = roleModules_(user);
  const out = {};
  Object.keys(value).forEach(function(key) {
    assert_(allowed.indexOf(key) >= 0 && ['none', 'view', 'edit'].indexOf(value[key]) >= 0,
      'Invalid permission for ' + key);
    out[key] = value[key];
  });
  return out;
}

function moduleAccess_(user, key) {
  if (user.role === 'admin') return 'edit';
  if (key === 'uploads') {
    return [moduleAccess_(user, 'teams'), moduleAccess_(user, 'players'), moduleAccess_(user,
        'rosterRequests')].indexOf('edit') >= 0 ? 'edit' :
      'none';
  }
  if (roleModules_(user).indexOf(key) < 0 || accessLevel_(user) === 'none') return 'none';
  const configured = user.moduleAccess || {};
  const mode = Object.keys(configured).length ? (configured[key] || 'none') : accessLevel_(user);
  if (['none', 'view', 'edit'].indexOf(mode) < 0) return 'none';
  return accessLevel_(user) === 'view' && mode === 'edit' ? 'view' : mode;
}

function accessLevel_(user) {
  if (user.role === 'admin') return 'edit';
  // Existing accounts keep their previous role behavior after upgrading.
  const level = user.accessLevel || 'edit';
  return ['none', 'view', 'edit'].indexOf(level) >= 0 ? level : 'none';
}

function safeUser_(user) {
  const safe = pick_(user, ['id', 'accountCode', 'disabled', 'tournamentId', 'managedBy', 'name', 'email', 'phone', 'role', 'verified']);
  safe.accessLevel = accessLevel_(user);
  safe.moduleAccess = {};
  roleModules_(user).forEach(function(key) {
    safe.moduleAccess[key] = moduleAccess_(user, key);
  });
  return safe;
}

function rate_(key, max, seconds) {
  const cache = CacheService.getScriptCache();
  const k = 'rate:' + key;
  const count = Number(cache.get(k) || 0);
  assert_(count < max, 'Too many attempts. Please try again later.');
  cache.put(k, String(count + 1), seconds);
}

function password_(value) {
  const s = String(value || '');
  assert_(s.length >= 10 && s.length <= 128, 'Use a password with 10–128 characters.');
  return s;
}

function passwordHash_(password, salt) {
  // Salted, iterated digest for member passwords; ADMIN_PASSWORD stays centralized.
  let value = String(salt) + ':' + password;
  for (let i = 0; i < APP.passwordRounds; i++) value = digest_(value + ':' + salt);
  return value;
}

function digest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8)
    .map(function(b) {
      return ('0' + ((b + 256) % 256).toString(16)).slice(-2);
    }).join('');
}

function audit_(action, type, entityId, details, actor) {
  put_('Audit', {
    action: action,
    entityType: type,
    entityId: entityId,
    details: details,
    actor: actor
  });
}

function notify_(userId, message) {
  if (userId) put_('Notifications', {
    userId: userId,
    message: message,
    read: false
  });
}

function notifyManagers_(t, message) {
  Array.from(new Set(['ADMIN'].concat(active_('Users').filter(function(u) {
    return u.role === 'operator' && u.verified;
  }).map(function(u) {
    return u.id;
  }), t.managerIds || []))).forEach(function(id) {
    notify_(id, message);
  });
}

function notifyTeams_(match, message) {
  [match.teamA, match.teamB].filter(Boolean).forEach(function(id) {
    notify_(get_('Teams', id).ownerId, message);
  });
}

function id_() {
  return Utilities.getUuid();
}

function now_() {
  return new Date().toISOString();
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase();
}

function phone_(value) {
  return String(value || '').replace(/[^0-9+]/g, '');
}

function assert_(condition, message) {
  if (!condition) throw new Error(message);
}

function required_(value, max) {
  const s = String(value || '').trim();
  assert_(s && s.length <= max, 'Required field missing or too long (max ' + max + ').');
  return s;
}

function email_(value) {
  const s = normalize_(value);
  assert_(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254, 'Invalid email.');
  return s;
}

function integer_(value, min, max) {
  assert_(value !== '' && value !== null && value !== undefined && Number.isInteger(Number(value)) && Number(
    value) >= min && Number(value) <= max, 'Number must be between ' + min + ' and ' + max + '.');
  return Number(value);
}

function iso_(value) {
  const n = new Date(value);
  assert_(!isNaN(n.getTime()), 'Invalid date/time.');
  return n.toISOString();
}

function dateOnly_(value) {
  assert_(/^\d{4}-\d{2}-\d{2}$/.test(String(value)) && iso_(value).slice(0, 10) === value, 'Invalid date.');
  return value;
}

function safeUrl_(value) {
  const s = String(value || '').trim();
  assert_(!s || (/^https:\/\/[^\s<>"']+$/i.test(s) && s.length < 2000), 'Use a valid HTTPS URL.');
  return s;
}

function pick_(source, keys) {
  const out = {};
  keys.forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(source, key)) out[key] = source[key];
  });
  return out;
}

function minutes_(value) {
  const p = String(value).split(':').map(Number);
  return p[0] * 60 + p[1];
}

function shuffle_(items) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = out[i];
    out[i] = out[j];
    out[j] = swap;
  }
  return out;
}

function newResultCode_() {
  const prefix = 'DY-' + Utilities.formatDate(new Date(), APP.timezone, 'yyyyMMdd') + '-';
  const existing = rows_('Results').concat(rows_('Teams'), rows_('Players'), rows_('PlayerTransfers'), rows_(
    'RosterRequests')).map(
    function(r) {
      return r.verificationCode;
    });
  const history = JSON.stringify(rows_('Audit'));
  for (let attempt = 0; attempt < 100; attempt++) {
    const suffix = id_().replace(/-/g, '').slice(0, 4).toUpperCase();
    const code = prefix + suffix;
    if (existing.indexOf(code) < 0 && history.indexOf(code) < 0) return code;
  }
  throw new Error('Cannot allocate a verification code. Please retry.');
}

function verificationUrl_(code) {
  return WEB_APP_URL + '?verify=' + encodeURIComponent(code);
}

function playerAgeIssue_(player, tournament) {
  if ((tournament.minAge === '' || tournament.minAge == null) &&
      (tournament.maxAge === '' || tournament.maxAge == null)) return '';
  const reference = tournament.ageCutoffDate || tournament.startDate;
  const birth = String(player.birthDate || '').slice(0,10);
  let valid = true;
  try {dateOnly_(birth); dateOnly_(reference);} catch (e) {valid = false;}
  if (!valid || birth > reference) return 'AGE_RULE: ' + player.name + ' · ກະລຸນາກວດວັນເກີດ/ວັນທີຄິດອາຍຸ.';
  const age = Number(reference.slice(0,4)) - Number(birth.slice(0,4)) - (reference.slice(5) < birth.slice(5) ? 1 : 0);
  if ((tournament.minAge !== '' && tournament.minAge != null && age < Number(tournament.minAge)) ||
      (tournament.maxAge !== '' && tournament.maxAge != null && age > Number(tournament.maxAge)))
    return 'AGE_RULE: ' + player.name + ' · ອາຍຸ ' + age + ' ປີ · ບໍ່ຜ່ານເກນ ' +
      (tournament.minAge == null || tournament.minAge === '' ? '—' : tournament.minAge) + '–' +
      (tournament.maxAge == null || tournament.maxAge === '' ? '—' : tournament.maxAge) + ' · ' + reference;
  return '';
}
function assertPlayerAge_(player, tournament) {
  const issue = playerAgeIssue_(player,tournament); assert_(!issue,issue);
}

function validatePlayer_(player, t) {
  assertPlayerAge_(player,t);
  const players = active_('Players').filter(function(p) {
    return p.id !== player.id;
  });
  assert_(players.filter(function(p) {
    return p.entryId === player.entryId;
  }).length < t.maxPlayers, 'Roster is full.');
  assert_(!players.some(function(p) {
    return p.entryId === player.entryId && p.identityKey === player.identityKey;
  }), 'Player already in this roster.');
  { // One athlete may have only one active roster in a tournament.
    const ids = active_('Entries').filter(function(e) {
      return e.tournamentId === t.id;
    }).map(function(e) {
      return e.id;
    });
    assert_(!players.some(function(p) {
        return ids.indexOf(p.entryId) >= 0 && p.identityKey === player.identityKey;
      }),
      'DUPLICATE_ATHLETE: ນັກກິລາລົງທະບຽນກັບອີກທີມໃນລາຍການນີ້ແລ້ວ. ໃຊ້ປຸ່ມຄົ້ນຫາ/ຂໍຮັບໂອນເພື່ອເບິ່ງທີມຕົ້ນສັງກັດ. Player already registered with another team in this tournament.'
    );
  }
}

function approvedEntries_(id) {
  const teams = active_('Teams').map(function(t) {
    return t.id;
  });
  return active_('Entries').filter(function(e) {
    return e.tournamentId === id && e.status === 'approved' && teams.indexOf(e.teamId) >= 0;
  });
}

function validateParticipants_(t, a, b) {
  const ids = approvedEntries_(t.id).map(function(e) {
    return e.teamId;
  });
  assert_(a && b && a !== b && ids.indexOf(a) >= 0 && ids.indexOf(b) >= 0,
    'Choose two different approved teams.');
}

function validateReferee_(id) {
  if (!id) return;
  const user = get_('Users', id);
  assert_(!user.archived && user.verified && user.role === 'referee', 'Choose an active verified referee.');
}

function validateGroups_(entries) {
  entries.forEach(function(entry, i) {
    assert_(!entries.slice(i + 1).some(function(other) {
      return entry.group === other.group && ((entry.pot && entry.pot === other.pot) || (entry
        .avoidTag && entry.avoidTag === other.avoidTag));
    }), 'Group violates pot or separation restrictions.');
  });
}

function leaguePlan_(t, teamIds, group) {
  const rotation = teamIds.slice();
  if (rotation.length % 2) rotation.push(null);
  const count = rotation.length;
  const firstLeg = [];
  for (let round = 1; round < count; round++) {
    for (let i = 0; i < count / 2; i++) {
      let a = rotation[i];
      let b = rotation[count - 1 - i];
      if (!a || !b) continue;
      if (round % 2 === 0) {
        const swap = a;
        a = b;
        b = swap;
      }
      firstLeg.push(newMatch_(t, {
        teamA: a,
        teamB: b,
        round: round,
        group: group,
        phase: group ? 'group' : 'league'
      }));
    }
    rotation.splice(1, 0, rotation.pop());
  }
  if (Number(t.legs) !== 2) return firstLeg;
  return firstLeg.concat(firstLeg.map(function(m) {
    return newMatch_(t, {
      teamA: m.teamB,
      teamB: m.teamA,
      round: m.round + count - 1,
      group: group,
      phase: m.phase
    });
  }));
}

function newMatch_(t, values) {
  return Object.assign({
    id: id_(),
    tournamentId: t.id,
    sportId: t.sportId,
    phase: 'league',
    group: '',
    round: 1,
    teamA: '',
    teamB: '',
    sourceA: '',
    sourceB: '',
    startAt: '',
    venue: '',
    duration: t.duration,
    refereeId: '',
    status: 'scheduled',
    demo: !!t.demo
  }, values);
}

function knockoutPlan_(t, entries, mode) {
  assert_(['seeded', 'random'].indexOf(mode) >= 0, 'Choose seeded or random draw.');
  const ordered = mode === 'seeded' ? entries.slice().sort(function(a, b) {
    return (a.seed || 999) - (b.seed || 999) || a.lot - b.lot;
  }) : shuffle_(entries);
  let size = 2;
  while (size < ordered.length) size *= 2;
  let seeds = [1, 2];
  while (seeds.length < size) {
    const total = seeds.length * 2 + 1;
    seeds = [].concat.apply([], seeds.map(function(seed) {
      return [seed, total - seed];
    }));
  }
  let nodes = seeds.map(function(seed) {
    return ordered[seed - 1] ? {
      teamId: ordered[seed - 1].teamId,
      source: ''
    } : null;
  });
  const matches = [];
  let round = 1;
  while (nodes.length > 1) {
    const next = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const a = nodes[i];
      const b = nodes[i + 1];
      if (!a || !b) {
        next.push(a || b);
        continue;
      }
      const match = newMatch_(t, {
        phase: 'knockout',
        round: round,
        teamA: a.teamId || '',
        teamB: b.teamId || '',
        sourceA: a.source || '',
        sourceB: b.source || ''
      });
      matches.push(match);
      next.push({
        teamId: '',
        source: match.id
      });
    }
    nodes = next;
    round++;
  }
  return matches;
}

function descendantMatches_(id) {
  const all = active_('Matches');
  const ids = [id];
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    all.filter(function(m) {
      return m.sourceA === ids[i] || m.sourceB === ids[i];
    }).forEach(function(m) {
      if (ids.indexOf(m.id) < 0) {
        ids.push(m.id);
        out.push(m);
      }
    });
  }
  return out;
}

function advanceKnockout_(match, winnerId) {
  if (match.phase !== 'knockout' || !winnerId) return;
  active_('Matches').filter(function(m) {
    return m.sourceA === match.id || m.sourceB === match.id;
  }).forEach(function(m) {
    if (m.sourceA === match.id) m.teamA = winnerId;
    if (m.sourceB === match.id) m.teamB = winnerId;
    put_('Matches', m);
    notifyTeams_(m, 'Advanced to knockout round ' + m.round);
  });
}

function possibleTeams_(match, all, seen) {
  const visited = (seen || []).concat(match.id);
  let ids = [match.teamA, match.teamB].filter(Boolean);
  [match.sourceA, match.sourceB].filter(Boolean).forEach(function(id) {
    assert_(visited.indexOf(id) < 0, 'Invalid bracket cycle.');
    const source = all.find(function(m) {
      return m.id === id;
    });
    if (source) ids = ids.concat(possibleTeams_(source, all, visited));
  });
  return Array.from(new Set(ids));
}

function validateSlot_(match, t, all) {
  if (!match.startAt || ['cancelled', 'postponed'].indexOf(match.status) >= 0) return;
  const start = new Date(match.startAt).getTime();
  const finish = start + match.duration * 60000;
  const localDate = Utilities.formatDate(new Date(start), APP.timezone, 'yyyy-MM-dd');
  const localTime = Utilities.formatDate(new Date(start), APP.timezone, 'HH:mm');
  const weekday = new Date(localDate + 'T00:00:00Z').getUTCDay();
  assert_((!t.startDate || localDate >= t.startDate) && (!t.endDate || localDate <= t.endDate) && t.weekdays
    .indexOf(weekday) >= 0 && t.blackoutDates.indexOf(localDate) < 0,
    'SLOT: Date outside allowed competition days.');
  assert_(minutes_(localTime) >= minutes_(t.dayStart) && minutes_(localTime) + match.duration <= minutes_(t
    .dayEnd), 'SLOT: Outside daily time window.');
  assert_(t.venues.indexOf(match.venue) >= 0, 'SLOT: Choose a tournament venue.');
  const teams = possibleTeams_(match, all.concat([match]));
  const tournaments = active_('Tournaments');
  all.filter(function(other) {
    return other.id !== match.id && other.startAt && ['cancelled', 'postponed'].indexOf(other.status) < 0;
  }).forEach(function(other) {
    const start2 = new Date(other.startAt).getTime();
    const end2 = start2 + other.duration * 60000;
    const otherT = tournaments.find(function(v) {
      return v.id === other.tournamentId;
    }) || t;
    const venueGap = Math.max(t.breakMinutes, otherT.breakMinutes) * 60000;
    const rest = Math.max(t.minRest, otherT.minRest) * 60000;
    const overlap = start < end2 && start2 < finish;
    assert_(!(match.venue === other.venue && start < end2 + venueGap && start2 < finish + venueGap),
      'SLOT: Venue conflict.');
    assert_(!(match.refereeId && match.refereeId === other.refereeId && overlap),
      'SLOT: Referee conflict.');
    const otherTeams = possibleTeams_(other, all);
    const shareTeam = teams.some(function(id) {
      return otherTeams.indexOf(id) >= 0;
    });
    assert_(!(shareTeam && start < end2 + rest && start2 < finish + rest),
      'SLOT: Team conflict or insufficient rest.');
  });
  [match.sourceA, match.sourceB].filter(Boolean).forEach(function(id) {
    const source = all.find(function(m) {
      return m.id === id;
    });
    assert_(source && source.startAt && new Date(source.startAt).getTime() + (source.duration + t
      .minRest) * 60000 <= start, 'SLOT: Schedule source rounds first.');
  });
  all.filter(function(m) {
    return m.startAt && (m.sourceA === match.id || m.sourceB === match.id);
  }).forEach(function(next) {
    assert_(finish + t.minRest * 60000 <= new Date(next.startAt).getTime(),
      'SLOT: Match ends after its dependent round.');
  });
}

function resultWinner_(match, t, result) {
  let a = result.scoreA;
  let b = result.scoreB;
  if (match.phase === 'knockout' && t.tieRule === 'extra_penalties' && a === b) {
    assert_(result.extraA != null && result.extraB != null, 'Enter extra-time goals.');
    a += result.extraA;
    b += result.extraB;
  }
  if (a !== b) return a > b ? match.teamA : match.teamB;
  if (match.phase !== 'knockout') return '';
  assert_(result.penaltyA != null && result.penaltyB != null && result.penaltyA !== result.penaltyB,
    'Knockout draw requires decisive penalties.');
  return result.penaltyA > result.penaltyB ? match.teamA : match.teamB;
}

function validateRestore_(table, record) {
  if (table === 'Tournaments') assert_(!get_('Sports', record.sportId).archived, 'Restore the sport first.');
  if (table === 'Entries') {
    assert_(!get_('Teams', record.teamId).archived && !get_('Tournaments', record.tournamentId).archived,
      'Restore the team/tournament first.');
    assert_(!active_('Entries').some(function(e) {
      return e.teamId === record.teamId && e.tournamentId === record.tournamentId;
    }), 'An active registration already exists.');
  }
  if (table === 'Players') {
    const entry = get_('Entries', record.entryId);
    assert_(!entry.archived, 'Restore registration first.');
    validatePlayer_(record, get_('Tournaments', entry.tournamentId));
  }
  if (table === 'Matches') {
    const t = get_('Tournaments', record.tournamentId);
    assert_(!t.archived, 'Restore tournament first.');
    [record.sourceA, record.sourceB].filter(Boolean).forEach(function(id) {
      assert_(!get_('Matches', id).archived, 'Restore source fixtures first.');
    });
    [record.teamA, record.teamB].filter(Boolean).forEach(function(id) {
      assert_(approvedEntries_(t.id).some(function(e) {
        return e.teamId === id;
      }), 'Restore approved registrations first.');
    });
    validateSlot_(record, t, active_('Matches'));
  }
}

// ---------------- Public projections and calculated statistics ----------------
function publicSettings_() {
  const out = {
    brandName: APP.title,
    accent: '#14a578'
  };
  rows_('Settings').forEach(function(r) {
    if (['brandName', 'accent'].indexOf(r.id) >= 0) out[r.id] = r.value;
  });
  return out;
}

function publicTeam_(r) {
  return pick_(r, ['id', 'name', 'school', 'shortName', 'color', 'logoUrl', 'coach', 'demo']);
}

function publicPlayer_(r) {
  return pick_(r, ['id', 'entryId', 'name', 'jersey', 'position', 'photoUrl', 'demo', 'playerCode']);
}

function publicEntry_(r) {
  return pick_(r, ['id', 'tournamentId', 'teamId', 'status', 'group', 'seed', 'pot', 'lot', 'demo']);
}

function publicTournament_(r) {
  return pick_(r, ['id', 'name', 'sportId', 'format', 'legs', 'groupCount', 'qualifyPerGroup', 'bestExtra',
    'pointsWin', 'pointsDraw', 'pointsLoss', 'tiebreakers', 'startDate', 'endDate', 'published',
    'schedulePublished', 'demo', 'minAge', 'maxAge', 'ageCutoffDate']);
}

function publicMatch_(r) {
  return pick_(r, ['id', 'tournamentId', 'sportId', 'phase', 'group', 'round', 'teamA', 'teamB', 'sourceA',
    'sourceB', 'venue', 'startAt', 'duration', 'status', 'specialOutcome', 'notes', 'demo']);
}

function publicResult_(r) {
  const out = pick_(r, ['id', 'matchId', 'scoreA', 'scoreB', 'extraA', 'extraB', 'penaltyA', 'penaltyB',
    'winnerId', 'resultText', 'events', 'status', 'verificationCode', 'confirmedAt', 'certifierName',
    'topScorerA', 'topScorerB', 'demo', 'cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB']);
  out.verificationUrl = verificationUrl_(r.verificationCode);
  return out;
}

function publicStandings_(tournaments, entries, matches, results) {
  const out = {};
  tournaments.forEach(function(t) {
    out[t.id] = standings_(t, entries.filter(function(e) {
      return e.tournamentId === t.id;
    }), matches.filter(function(m) {
      return m.tournamentId === t.id;
    }), results);
  });
  return out;
}

function standings_(t, entries, matches, results, ignoreAdjustments) {
  const groups = {};
  entries.forEach(function(entry) {
    const group = t.format === 'groups' ? entry.group : 'League';
    if (!groups[group]) groups[group] = [];
    groups[group].push({
      teamId: entry.teamId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      fairPlay: 0,
      lot: Number(entry.lot || 0)
    });
  });
  Object.keys(groups).forEach(function(group) {
    const table = groups[group];
    const played = [];
    matches.filter(function(m) {
      return m.phase !== 'knockout' && m.status !== 'cancelled' && (t.format !== 'groups' || m
        .group === group);
    }).forEach(function(match) {
      const result = results.find(function(r) {
        return r.matchId === match.id && r.status === 'approved';
      });
      const a = table.find(function(r) {
        return r.teamId === match.teamA;
      });
      const b = table.find(function(r) {
        return r.teamId === match.teamB;
      });
      if (!result || !a || !b) return;
      played.push({
        match: match,
        result: result
      });
      a.played++;
      b.played++;
      a.goalsFor += result.scoreA;
      a.goalsAgainst += result.scoreB;
      b.goalsFor += result.scoreB;
      b.goalsAgainst += result.scoreA;
      if (result.scoreA > result.scoreB) {
        a.wins++;
        b.losses++;
        a.points += t.pointsWin;
        b.points += t.pointsLoss;
      } else if (result.scoreA < result.scoreB) {
        b.wins++;
        a.losses++;
        b.points += t.pointsWin;
        a.points += t.pointsLoss;
      } else {
        a.draws++;
        b.draws++;
        a.points += t.pointsDraw;
        b.points += t.pointsDraw;
      }
      (result.events || []).forEach(function(event) {
        const target = event.teamId === a.teamId ? a : b;
        if (event.type === 'yellow') target.fairPlay += 1;
        if (event.type === 'red') target.fairPlay += 3;
      });
    });
    if (!ignoreAdjustments) active_('StandingsAdjustments').filter(a => a.tournamentId === t.id && a.group === group && entries.some(e => e.id === a.entryId && e.teamId === a.teamId)).forEach(a => {
      const row = table.find(r => r.teamId === a.teamId);
      if (row) ['played','wins','draws','losses','goalsFor','goalsAgainst','points'].forEach(key => row[key] += Number(a[key+'Delta'] || 0));
    });
    table.forEach(function(r) {
      r.goalDifference = r.goalsFor - r.goalsAgainst;
    });
    // Rank tied blocks recursively: head-to-head uses a mini-table for the entire tied block.
    groups[group] = rankBlock_(table, ['points'].concat(t.tiebreakers || []), 0, played, t);
  });
  return groups;
}

function rankBlock_(block, criteria, index, played, t) {
  if (block.length < 2 || index >= criteria.length) return block.slice().sort(function(a, b) {
    return a.teamId.localeCompare(b.teamId);
  });
  const key = criteria[index];
  const value = {};
  if (key === 'headToHead') {
    const ids = block.map(function(r) {
      return r.teamId;
    });
    block.forEach(function(r) {
      value[r.teamId] = [0, 0, 0];
    });
    played.filter(function(p) {
      return ids.indexOf(p.match.teamA) >= 0 && ids.indexOf(p.match.teamB) >= 0;
    }).forEach(function(p) {
      const a = value[p.match.teamA];
      const b = value[p.match.teamB];
      const x = p.result.scoreA;
      const y = p.result.scoreB;
      a[0] += x > y ? t.pointsWin : x === y ? t.pointsDraw : t.pointsLoss;
      b[0] += y > x ? t.pointsWin : x === y ? t.pointsDraw : t.pointsLoss;
      a[1] += x - y;
      b[1] += y - x;
      a[2] += x;
      b[2] += y;
    });
  } else {
    block.forEach(function(r) {
      value[r.teamId] = [(key === 'fairPlay' || key === 'lot' ? -1 : 1) * Number(r[key] || 0)];
    });
  }

  function compare(a, b) {
    const x = value[a.teamId];
    const y = value[b.teamId];
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) return y[i] - x[i];
    }
    return 0;
  }
  const sorted = block.slice().sort(compare);
  const chunks = [];
  sorted.forEach(function(r) {
    if (!chunks.length || compare(chunks[chunks.length - 1][0], r)) chunks.push([r]);
    else chunks[chunks.length - 1].push(r);
  });
  return [].concat.apply([], chunks.map(function(chunk) {
    return rankBlock_(chunk, criteria, index + 1, played, t);
  }));
}

function officialPlayerStats_(entries, matches, results) {
  const stats = {};
  results.forEach(function(result) {
    if (result.status !== 'approved') return;
    const match = matches.find(function(m) {
      return m.id === result.matchId;
    });
    if (!match) return;
    (result.events || []).forEach(function(event) {
      const key = match.tournamentId + ':' + event.playerId;
      if (!stats[key]) stats[key] = {
        playerId: event.playerId,
        teamId: event.teamId,
        tournamentId: match.tournamentId,
        goals: 0,
        yellow: 0,
        red: 0
      };
      stats[key][event.type === 'goal' ? 'goals' : event.type]++;
    });
  });
  return Object.keys(stats).map(function(key) {
    return stats[key];
  }).sort(function(a, b) {
    return b.goals - a.goals || a.red - b.red || a.yellow - b.yellow;
  });
}

function playerStats_(entries, matches, results) {
  const rows = officialPlayerStats_(entries,matches,results);
  active_('StatAdjustments').forEach(adjustment => {
    const player = get_('Players',adjustment.playerId);
    if (player.archived || !entries.some(e => e.id === player.entryId && e.teamId === adjustment.teamId && e.tournamentId === adjustment.tournamentId)) return;
    let row = rows.find(r => r.playerId === adjustment.playerId && r.tournamentId === adjustment.tournamentId);
    if (!row) { row = {playerId:adjustment.playerId,teamId:adjustment.teamId,tournamentId:adjustment.tournamentId,goals:0,yellow:0,red:0}; rows.push(row); }
    ['goals','yellow','red'].forEach(key => row[key] = Math.max(0,row[key] + Number(adjustment[key+'Delta'] || 0)));
  });
  return rows.sort((a,b) => b.goals-a.goals || a.red-b.red || a.yellow-b.yellow);
}
function statEditor_(token,readOnly) {
  const user = auth_(token,readOnly,'results');
  assert_(competitionAdmin_(user),'Only Super Admin or Admin staff edit statistics.');return user;
}
function getStandingsEditData(token) {
  statEditor_(token,true);
  const entries = active_('Entries').filter(e => e.status === 'approved');
  return {standings:publicStandings_(active_('Tournaments'),entries,active_('Matches'),active_('Results')),
    adjustments:active_('StandingsAdjustments').map(a => ({entryId:a.entryId,reason:a.reason,revision:a.revision}))};
}
function saveStandingsAdjustment(token,data) {
  return write_(function() {
    const user = statEditor_(token,false), entry = get_('Entries',data.entryId), tournament = get_('Tournaments',entry.tournamentId);
    assert_(!entry.archived && entry.status === 'approved' && !tournament.archived && tournament.format !== 'knockout' && !get_('Teams',entry.teamId).archived,'An approved league or group entry is required.');
    const reason = required_(data.reason,1000), values = {};
    ['played','wins','draws','losses','goalsFor','goalsAgainst','points'].forEach(key => values[key] = integer_(data[key],key === 'points' ? -1000000 : 0,1000000));
    assert_(values.played === values.wins + values.draws + values.losses,'Played must equal wins + draws + losses.');
    const old = active_('StandingsAdjustments').find(a => a.entryId === entry.id) || {};
    assert_((data.revision || '') === (old.revision || ''),'Standings changed. Reopen the form and try again.');
    const group = tournament.format === 'groups' ? entry.group : 'League';
    const current = getStandingsEditData(token).standings[tournament.id][group].find(r => r.teamId === entry.teamId);
    assert_(data.expectedTotals && Object.keys(values).every(key => Number(data.expectedTotals[key]) === current[key]),'Standings changed. Reopen the form and try again.');
    const base = standings_(tournament,active_('Entries').filter(e => e.tournamentId === tournament.id && e.status === 'approved'),active_('Matches').filter(m => m.tournamentId === tournament.id),active_('Results'),true)[group].find(r => r.teamId === entry.teamId);
    const adjustment = Object.assign({},old,{entryId:entry.id,tournamentId:tournament.id,teamId:entry.teamId,group:group,reason:reason,revision:Utilities.getUuid(),updatedBy:user.id});
    Object.keys(values).forEach(key => adjustment[key+'Delta'] = values[key] - base[key]);
    put_('StandingsAdjustments',adjustment);
    audit_('edit-standings','StandingsAdjustments',adjustment.id,{before:old,after:adjustment,totals:values},user.id);
    return {ok:true};
  });
}

function getStatEditOptions(token) {
  statEditor_(token,true);
  const entries = active_('Entries'), tournaments = active_('Tournaments');
  const totals = playerStats_(entries,active_('Matches'),active_('Results'));
  return active_('Players').filter(p => (!p.status || p.status === 'approved') && entries.some(e =>
    e.id === p.entryId && e.status === 'approved' && tournaments.some(t => t.id === e.tournamentId && t.published && t.schedulePublished)))
    .map(p => {
      const entry = get_('Entries',p.entryId), row = totals.find(r => r.playerId === p.id && r.tournamentId === entry.tournamentId) || {};
      return {id:p.id,name:p.name,playerCode:p.playerCode,teamName:get_('Teams',entry.teamId).name,
        tournamentName:get_('Tournaments',entry.tournamentId).name,tournamentId:entry.tournamentId,
        goals:row.goals||0,yellow:row.yellow||0,red:row.red||0};
    });
}
function savePlayerStats(token,data) {
  return write_(function() {
    const user = statEditor_(token,false), player = get_('Players',data.playerId),
      entry = get_('Entries',player.entryId), tournament = get_('Tournaments',entry.tournamentId);
    assert_(!player.archived && (!player.status || player.status === 'approved') && !entry.archived && entry.status === 'approved' &&
      !get_('Teams',entry.teamId).archived && !tournament.archived && tournament.published && tournament.schedulePublished,'Athlete is not on an official published roster.');
    const reason = required_(data.reason,1000);
    const values = {}; ['goals','yellow','red'].forEach(key => values[key]=integer_(data[key],0,1000000));
    const base = officialPlayerStats_(active_('Entries'),active_('Matches'),active_('Results')).find(r => r.playerId === player.id && r.tournamentId === tournament.id) || {};
    const old = active_('StatAdjustments').find(r => r.playerId === player.id && r.tournamentId === tournament.id) || {};
    const adjustment = Object.assign({},old,{playerId:player.id,teamId:entry.teamId,tournamentId:tournament.id,reason:reason,updatedBy:user.id});
    ['goals','yellow','red'].forEach(key => adjustment[key+'Delta']=values[key]-Number(base[key]||0));
    put_('StatAdjustments',adjustment);
    audit_('edit-player-stats','StatAdjustments',adjustment.id,{before:old,after:adjustment,totals:values},user.id);
    return {ok:true};
  });
}

function liveConsoleAccess_(token,matchId,readOnly) {
  const user = auth_(token,readOnly,'results'), match = get_('Matches',matchId), t = get_('Tournaments',match.tournamentId);
  assert_(!match.archived && !t.archived && match.teamA && match.teamB,'Match unavailable.');
  assert_(manages_(user,t) || (user.role === 'referee' && match.refereeId === user.id),'Only assigned referees or tournament managers record live events.');
  return {user:user,match:match};
}
function liveConsoleSnapshot_(match,user) {
  const result = active_('Results').find(r=>r.matchId===match.id) || {};
  const entries = active_('Entries').filter(e=>e.tournamentId===match.tournamentId && [match.teamA,match.teamB].indexOf(e.teamId)>=0);
  const players = active_('Players').filter(p=>entries.some(e=>e.id===p.entryId)).map(p=>({id:p.id,name:p.name,playerCode:p.playerCode,jersey:p.jersey,teamId:entries.find(e=>e.id===p.entryId).teamId}));
  return {matchId:match.id,clock:matchClockSnapshot_(match.id),status:result.status||match.status,teamA:match.teamA,teamB:match.teamB,
    teamAName:get_('Teams',match.teamA).name,teamBName:get_('Teams',match.teamB).name,
    scoreA:Number(result.scoreA||0),scoreB:Number(result.scoreB||0),updatedAt:result.updatedAt||'',players:players,
    metrics:pick_(result,['cornersA','cornersB','throwInsA','throwInsB','possessionA','possessionB']),
    canEditMetrics:!!user && canReviewTournament_(user,get_('Tournaments',match.tournamentId)) && moduleAccess_(user,'results')==='edit',
    events:(result.events||[]).map(e=>Object.assign({},e,{playerName:(players.find(p=>p.id===e.playerId)||{}).name||e.playerId}))};
}
function getLiveMatchConsole(token,matchId) {
  const access=liveConsoleAccess_(token,matchId,true);return liveConsoleSnapshot_(access.match,access.user);
}
function addLiveMatchEvent(token,data) {
  return write_(function() {
    const access=liveConsoleAccess_(token,data.matchId,false),match=access.match;
    assert_(['goal','yellow','red'].indexOf(data.type)>=0,'Invalid live event.');
    assert_(/^[A-Za-z0-9-]{12,100}$/.test(String(data.requestId||'')),'Invalid event request ID.');
    const old=active_('Results').find(r=>r.matchId===match.id);
    const prior=old&&(old.events||[]).find(e=>e.eventId===data.requestId);
    if (prior) {assert_(prior.playerId===data.playerId && prior.type===data.type && (data.useClock===true || prior.minute===Number(data.minute)),'Event request ID already used.');return Object.assign({ok:true,duplicate:true},liveConsoleSnapshot_(match,access.user));}
    assert_(!old || old.status==='live','Match is awaiting certification or already certified.');
    assert_(['scheduled','live'].indexOf(match.status)>=0,'Match is not open for live recording.');
    const player=get_('Players',data.playerId), entry=get_('Entries',player.entryId);
    assert_(!player.archived && !entry.archived && entry.tournamentId===match.tournamentId && [match.teamA,match.teamB].indexOf(entry.teamId)>=0,'Athlete is outside this match roster.');
    const minute=data.useClock===true?Math.floor(matchClockSnapshot_(match.id).elapsedSeconds/60):integer_(data.minute,0,1000), events=(old&&old.events||[]).slice();
    events.push({eventId:data.requestId,playerId:player.id,type:data.type,minute:minute});
    const payload=Object.assign({},old||{scoreA:0,scoreB:0},{matchId:match.id,live:true,events:events});
    if(data.type==='goal') {
      const key=entry.teamId===match.teamA?'scoreA':'scoreB';payload[key]=Number(payload[key]||0)+1;
      const tally={};events.filter(e=>e.type==='goal').forEach(e=>tally[e.playerId]=(tally[e.playerId]||0)+1);
      ['A','B'].forEach(side=>{
        const eligible=active_('Players').filter(p=>active_('Entries').some(e=>e.id===p.entryId&&e.tournamentId===match.tournamentId&&e.teamId===match['team'+side]));
        const leader=eligible.filter(p=>tally[p.id]).sort((a,b)=>tally[b.id]-tally[a.id])[0];
        if(leader) payload['topScorer'+side+'Id']=leader.id;
      });
    }
    submitResultData_(token,payload);
    audit_('auto-live-event','Matches',match.id,{eventId:data.requestId,playerId:player.id,type:data.type,minute:minute},access.user.id);
    return Object.assign({ok:true},liveConsoleSnapshot_(get_('Matches',match.id),access.user));
  });
}

function updateLiveMatchMetrics(token,data) {
  return write_(function() {
    const access=liveConsoleAccess_(token,data.matchId,false),match=access.match;
    assert_(canReviewTournament_(access.user,get_('Tournaments',match.tournamentId)),'Only authorized competition staff update team metrics.');
    assert_(/^[A-Za-z0-9-]{12,100}$/.test(String(data.requestId||'')),'Invalid metric request ID.');
    const receipt=rows_('Audit').find(r=>r.action==='auto-live-metric' && r.entityId===match.id && r.details.requestId===data.requestId);
    if(receipt) {assert_(receipt.details.key===data.key && receipt.details.value===data.value,'Metric request ID already used.');return Object.assign({ok:true,duplicate:true},liveConsoleSnapshot_(match,access.user));}
    const old=active_('Results').find(r=>r.matchId===match.id);
    assert_(!old || old.status==='live','Only live team statistics can be updated.');
    assert_(['scheduled','live'].indexOf(match.status)>=0,'Match is not open for live recording.');
    const payload=Object.assign({},old||{scoreA:0,scoreB:0,events:[]},{matchId:match.id,live:true});
    if(['possessionA','possessionB'].indexOf(data.key)>=0) {
      payload[data.key]=integer_(data.value,0,100);payload[data.key==='possessionA'?'possessionB':'possessionA']=100-payload[data.key];
    } else {
      assert_(['cornersA','cornersB','throwInsA','throwInsB'].indexOf(data.key)>=0,'Invalid team metric.');
      assert_(data.value===1 || data.value===-1,'Use +1 or -1.');
      payload[data.key]=integer_(Number(payload[data.key]||0)+data.value,0,1000000);
    }
    submitResultData_(token,payload);
    audit_('auto-live-metric','Matches',match.id,{requestId:data.requestId,key:data.key,value:data.value},access.user.id);
    return Object.assign({ok:true},liveConsoleSnapshot_(get_('Matches',match.id),access.user));
  });
}

function matchClockSnapshot_(matchId) {
  const clock=rows_('MatchClocks').find(c=>c.id===matchId) || {};
  const elapsed=Number(clock.elapsedMs||0)+(clock.running?Math.max(0,Date.now()-new Date(clock.lastStartedAt).getTime()):0);
  return {elapsedSeconds:Math.min(60000,Math.floor(elapsed/1000)),running:!!clock.running};
}
function pauseMatchClock_(matchId) {
  const clock=rows_('MatchClocks').find(c=>c.id===matchId);
  if(clock&&clock.running){clock.elapsedMs=matchClockSnapshot_(matchId).elapsedSeconds*1000;clock.running=false;clock.lastStartedAt='';put_('MatchClocks',clock);}
}
function controlMatchClock(token,data) {
  return write_(function(){
    const access=liveConsoleAccess_(token,data.matchId,false),match=access.match;
    const result=active_('Results').find(r=>r.matchId===match.id);
    assert_(['scheduled','live'].indexOf(match.status)>=0&&(!result||result.status==='live'),'Clock is locked after submitting the final result.');
    assert_(['start','pause','set'].indexOf(data.action)>=0,'Invalid clock action.');
    const clock=rows_('MatchClocks').find(c=>c.id===match.id)||{id:match.id,elapsedMs:0,running:false};
    if(data.action==='set'){clock.elapsedMs=integer_(data.minute,0,1000)*60000;clock.running=false;clock.lastStartedAt='';}
    if(data.action==='start'&&!clock.running){clock.running=true;clock.lastStartedAt=now_();}
    if(data.action==='pause'&&clock.running){clock.elapsedMs=matchClockSnapshot_(match.id).elapsedSeconds*1000;clock.running=false;clock.lastStartedAt='';}
    clock.updatedBy=access.user.id;put_('MatchClocks',clock);
    if(!result) submitResultData_(token,{matchId:match.id,scoreA:0,scoreB:0,events:[],live:true});
    audit_('control-match-clock','Matches',match.id,{action:data.action,minute:data.minute||0},access.user.id);
    return Object.assign({ok:true},liveConsoleSnapshot_(get_('Matches',match.id),access.user));
  });
}
