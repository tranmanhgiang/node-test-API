export default {
    mailTemplate: {
        verificationCode: 'verification-code',
        verificationLogin: 'verification-login',
        uploadedFileToTeam: 'uploaded-file-to-team',
        uploadedFileToUser: 'uploaded-file-to-user',
        uploadedTranscriptionToTeam: 'uploaded-transcription-to-team',
        uploadedTranscriptionToUser: 'uploaded-transcription-to-user',
        inviteUser: 'invite-user',
    },
    validationAction: {
        signUp: 'SignUp',
        resetPassword: 'ResetPassword',
    },
    loginStatus: {
        success: 'SUCCESS',
        invalidAccount: 'INVALID_ACCOUNT',
        inactiveAccount: 'INACTIVE_ACCOUNT',
    },
    userRole: {
        editor: 'User',
        admin: 'Admin',
    },
    dictationStatus: {
        unassign: 'Unassign',
        inProgress: 'InProgress',
        submitted: 'Submitted',
        canceled: 'Canceled',
        finished: 'Finished',
    },
    canBeDeletedStatus: ['Canceled', 'Finished'],
};

export const USER_ROLE = {
    USER: 'User',
    ADMIN: 'Admin',
};

export const USER_STATUS = {
    ACTIVATED: 'Activated',
    DEACTIVATED: 'Deactivated',
};

export const DICTATION_STATUS = {
    INPROGRESS: 'InProgress',
    UNASSIGN: 'Unassign',
    SUBMITTED: 'Submitted',
    CANCELED: 'Canceled',
    FINISHED: 'Finished',
};

export const USER_ROLE_INVITATION = ['Admin', 'Editor', 'Assignee'];

export const TEMPLATE_SORT_TYPE = {
    LAST_TO_OLD: '1',
    OLD_TO_LAST: '2',
    A_Z: '3',
    Z_A: '4',
};

export const CONTENT_HTML_DIRECT_DOWNLOAD = `<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <h3>Link will direct you to download the audio!</h3>
    <script>
        const downloadAction = async () => { window.location.replace(window.location.href+"/download"); } 
        downloadAction();
    </script>
</body>
</html>`;

export const PASSWORD_RULE_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,32}$/;
