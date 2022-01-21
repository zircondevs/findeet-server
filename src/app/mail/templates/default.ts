import { templatesPayload } from '../MailTypes';

export default (payload: templatesPayload): string => {
    return `
        <div>
            <h1>Tesing Template Header</h1>
            <p>This is the content of the testing template</p>
        </div>
    `;
};
